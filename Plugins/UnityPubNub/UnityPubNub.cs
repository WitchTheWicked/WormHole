/*
 * Unity3D PubNub 3.0 Real-time Push Cloud API
 *
 * Copyright (c) 2011 Calvin Rien
 * based on the PubNub C# client by Stephen Blum
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must
 * not claim that you wrote the original software. If you use this
 * software in a product, an acknowledgment in the product documentation
 * would be appreciated but is not required.
 *
 * 2. Altered source versions must be plainly marked as such, and must
 * not be misrepresented as being the original software.
 *
 * 3. This notice may not be removed or altered from any source
 * distribution.
 *
 */
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using UnityEngine;
using DB = UnityEngine.Debug;
using PubNub;
using MiniJSON;

public class UnityPubNub : ScriptableObject {
	/// <summary>
	/// Channel name needs to be unique per key.
	/// 
	/// When using the demo keys your message can
	/// be received by anyoning use the same channel.
	/// </summary>
	string channel = "com.unity3d.test.pubnub";
	string pubKey = "pub-2e0c6d8f-f9e8-47ef-a62c-a6566bf38c96";
	string subKey = "sub-160935de-d0a3-11e1-a01e-571ee3cb04f6";
	bool secure = false;
	
	string origin;
	readonly string secretKey = "sec-OWMxZDUxZDQtM2I2NC00NzIxLWFjOGQtY2VjMTIzYzk4ZmEz";
	readonly string server = "pubsub.pubnub.com";
	readonly int limit = 1800;
	
	WWW subscription;

	bool subscribed = false;
	bool init = false;

	void OnEnable() {
	}

	void OnDisable() {
		subscribed = false;

		if (subscription != null) {
			subscription.Dispose();
		}

		subscription = null;
	}		
	
	#region Initializers
	public void Init(string ch) {
		Init(ch, pubKey, subKey, secure);
	}

	public void Init(string ch, string pub) {
		Init(ch, pub, subKey, secure);
	}

	public void Init(string ch, string pub, string sub) {
		Init(ch, pub, sub, secure);
	}
	
	public void Init(string ch, string pub, string sub, bool ssl) {
		if (init) {
			DB.LogWarning("Already initted. Destroy and create a new channel");
			return;
		}
		
		init = true;
		
		channel = ch;
		pubKey = pub;
		subKey = sub;
		secure = ssl;
		
		origin = string.Format("{0}{1}", (secure ? "https://" : "http://"), server);
	}
	#endregion
		
	#region History and Time
	/// <summary>
	/// Load history from a channel.
	/// 
	/// </summary>
	/// <param name="limit">
	/// A <see cref="System.Int32"/>
	/// </param>
	/// <param name="callback">
	/// A <see cref="Procedure"/>
	/// </param>
	public IEnumerator History(int limit, Procedure callback) {
		string[] url = {
			"history",
			subKey,
			channel,
			"0",
			limit.ToString()
		};
		
		return Request(url, response => {
			if (response == null) return;
			
			foreach (var res in response) {
				callback(res);
			}
		});
	}

	public IEnumerator History(Procedure callback) {
		return History(16, callback);
	}

	/// <summary>
	/// Timestamp from PubNub Cloud.
	/// </summary>
	/// <param name="callback">
	/// A <see cref="Procedure"/>
	/// </param>
	public IEnumerator Time(Procedure callback) {
		string[] url = {
			"time",
			"0"
		};

		return Request(url, response => {callback((long) response[0]);});
	}	
	#endregion
	
	#region Publish
	/// <summary>
	/// Publish the specified message.
	/// </summary>
	/// <param name='message'>
	/// Message.
	/// </param>
	public IEnumerator Publish(object message, RequestCallback callback) {
		return PublishJSON(Json.Serialize(message), callback);
	}

	/// <summary>
	/// Publish the specified message. I don't care what the response is.
	/// </summary>
	/// <param name='message'>
	/// Message.
	/// </param>
	public IEnumerator Publish(object message) {
		return PublishJSON(Json.Serialize(message), null);
	}

	/// <summary>
	/// PublishJSON
	/// 
	/// Send a message to a channel.
	/// </summary>
	/// <param name="json">
	/// A <see cref="System.Object"/>
	/// </param>
	/// <param name="callback">
	/// A <see cref="RequestCallback"/>
	/// </param>
	IEnumerator PublishJSON(string json, RequestCallback callback) {
		// Generate String to Sign

		string signature = "0";
		if (!string.IsNullOrEmpty(secretKey)) {
			string string_to_sign = string.Format("{0}/{1}/{2}/{3}/{4}", pubKey, subKey, secretKey, channel, json);

			// Sign Message
			signature = PubNub.Tools.MD5(string_to_sign);
		}
		
		// Build URL
		string[] url = {
			"publish",
			pubKey,
			subKey,
			signature,
			channel,
			"0",
			json
		};

		return Request(url, response => {
			if (callback != null) {
				callback(response);
			}
		});
	}
	#endregion
		
	#region Subscribe
	/// <summary>
	/// 
	/// </summary>
	/// <param name="channel">
	/// A <see cref="System.String"/>
	/// </param>
	/// <param name="callback">
	/// A <see cref="Procedure"/>
	/// </param>
	public IEnumerator Subscribe(Procedure callback) {
		if (subscribed) {
			DB.LogWarning("Already subscribed to channel: " + channel);
			yield break;
		}

		subscribed = true;

		object timetoken = 0;

		string[] url_components = {
			"subscribe",
			subKey,
			channel,
			"0",
			timetoken.ToString()
		};

		List<object> response;

		var url_builder = new StringBuilder(origin);
		
		int reset = url_builder.Length;
		
		while (subscribed) {
			url_builder.Length = reset;
			
			foreach (string url_bit in url_components) {
				url_builder.AppendFormat("/{0}", PubNub.Tools.EncodeURIcomponent(url_bit));
			}
			
			if (url_builder.Length > limit) {
				DB.LogError("subscription url too long");
				yield break;
			}
			
			using (WWW subscribe = new WWW(url_builder.ToString())) {
				subscription = subscribe;

				while (subscribed && !subscribe.isDone) {
					yield return null;
				}
				
				if (!subscribed) {
					subscribe.Dispose();
					yield break;
				} else if (!string.IsNullOrEmpty(subscribe.error)) {
					DB.LogError(string.Format("subscribe error: {0}", subscribe.error));

					subscribe.Dispose();
					subscribed = false;

					callback(null);
					
					yield break;
				} else {
					// Parse Response
					response = (List<object>) Json.Deserialize(subscribe.text);
				}

				subscription = null;
			}
			
			if (response == null || response.Count < 2) {
				continue;
			}
			
			if (response[1].ToString().Length > 0) {
				timetoken = (object) response[1];
			}
			
			// Run user Callback and Reconnect if user permits.
			foreach (object message in (List<object>) response[0]) {
				if (!callback(message)) {
					subscribed = false;

					yield break;
				}
			}

			url_components[url_components.Length - 1] = timetoken.ToString();
		}
	}

	/// <summary>
	/// Unsubscribe from a channel and dispose of the WWW object
	/// </summary>
	/// <param name="channel">
	/// A <see cref="System.String"/>
	/// </param>
	public void Unsubscribe() {
		subscribed = false;
	}
	#endregion
	
	/// <summary>
	/// Request URL
	/// </summary>
	/// <param name="url_components">
	/// A <see cref="List<System.String>"/>
	/// </param>
	/// <param name="rqcallback">
	/// A <see cref="RequestCallback"/>
	/// </param>
	IEnumerator Request(string[] url_components, RequestCallback rqcallback) {
		var url_builder = new StringBuilder(origin);
				
		// Generate URL with UTF-8 Encoding
		foreach (string url_bit in url_components) {
			url_builder.AppendFormat("/{0}", PubNub.Tools.EncodeURIcomponent(url_bit));
		}
		
		// Fail if string too long
		if (url_builder.Length > limit) {
			DB.LogError("request url too long");
						
			rqcallback(null);
		}

		using (WWW request = new WWW(url_builder.ToString())) {
			while (!request.isDone) {
				yield return null;
			}
			
			if (!string.IsNullOrEmpty(request.error)) {
				DB.LogError(string.Format("request error: {0}", request.error));
				
				rqcallback(null);
			} else {
				rqcallback((List<object>) Json.Deserialize(request.text));
			}
		}		
	}
}

namespace PubNub {
	using System.Security.Cryptography;
	
	public delegate bool Procedure(object message);

	public delegate void RequestCallback(List<object> response);

	public static class Tools {
		public static string UrlsafeBase64Encode(string inputText) {
			byte[] bytesToEncode = Encoding.UTF8.GetBytes(inputText);
			string encodedText = Convert.ToBase64String(bytesToEncode);
				
			encodedText = encodedText.Replace('+', '-').Replace('/', '_').TrimEnd('=');
				
			return encodedText;
		}
			
		public static string UrlsafeBase64Decode(string encodedText) {
			var len = encodedText.Length;
			
			if (len % 4 != 0) {
				len += 4 - (len % 4);
			}
				
			encodedText = encodedText.Replace('-', '+').Replace('_', '/').PadRight(len, '=');
				
			byte[] decodedBytes = Convert.FromBase64String(encodedText);
			string decodedText = Encoding.UTF8.GetString(decodedBytes);
							
			return decodedText;
		}

		public static string EncodeURIcomponent(string s) {
			if (string.IsNullOrEmpty(s)) {
				return null;	
			}
			
			var o = new StringBuilder();
			foreach (char ch in s.ToCharArray()) {
				if (" ~`!@#$%^&*()+=[]\\{}|;':\",./<>?".IndexOf(ch) >= 0) {
					// encode characters that aren't urlsafe.
					o.AppendFormat("%{0:x2}", (uint) System.Convert.ToUInt32(ch));
				} else {
					o.Append(ch);
				}
			}
			return o.ToString();
		}
			
		public static string MD5(string strToEncrypt) {
			System.Text.UTF8Encoding ue = new System.Text.UTF8Encoding();
			byte[] bytes = ue.GetBytes(strToEncrypt);
			
			// encrypt bytes
			using (MD5CryptoServiceProvider md5crypt = new MD5CryptoServiceProvider()) {
				byte[] hashBytes = md5crypt.ComputeHash(bytes);
				
				// Convert the encrypted bytes back to a string (base 16)
				var hashString = new StringBuilder(hashBytes.Length * 2);
				
				for (int i = 0; i < hashBytes.Length; i++) {
					hashString.Append(System.Convert.ToString(hashBytes[i], 16).PadLeft(2, '0'));
				}
				
				return hashString.ToString().PadLeft(32, '0');
			}
		}
	}
}
