using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using DB = UnityEngine.Debug;



public class PubNubChat : MonoBehaviour {

	UnityPubNub pubnub;
	
	public Multiplayer multiplayer;
	public GUISkin skin;
	public Color[] colors = {Color.blue, Color.cyan, Color.gray, Color.magenta, Color.red, Color.yellow};

	const string CHATBOX = "chatbox";
	const string NAMEBOX = "namebox";
	
	public string player_name;
	string currentChat;
	Vector2 scrollPosition;

	//Rect windowRect;
	List<Message> messages;
	Dictionary<string, Client> clients;

	Client localClient;

	static int colorIndex = -1;

	Color NextColor {
		get {
			colorIndex++;

			if (colorIndex >= colors.Length) {
				colorIndex = 0;
			}

			return colors[colorIndex];
		}
	}
	
	class Message {
		public string client;
		public string name;
		public string msg;
		public long id;
	
		static int message_id = 0;
	
		public Message(string message, Client client) {
			this.client = client.id;
			this.name = client.name;
			this.msg = message;
			this.id = message_id++;
		}
	
		public Message(IDictionary value) {
			client = (string) value["client"];
			name = (string) value["name"];
			msg = (string) value["msg"];
			id = (long) value["id"];
		}
	
		public IDictionary Digest {
			get {
				var output = new Dictionary<string, object>();
	
				output["client"] = client;
				output["name"] = name;
				output["msg"] = msg;
				output["id"] = id;
	
				return output;
			}
		}
	}

	class Client {
		public string id;
		public string name;
		public Color color;
	
		public Client(string id, string name, Color color) {
			this.id = id;
			this.name = name;
			this.color = color;
		}
	}	
	
	public void Start()
	{
		 player_name = string.Format("Guest.{0:00000}",Random.Range(0, 99999));
		print ("My name is: " + player_name);
	}
	void OnEnable() {
		var id = PlayerPrefs.GetString("client_id", System.Guid.NewGuid().ToString());
		var name = player_name;

		localClient = new Client(id, name, Color.white);
				
		//windowRect = new Rect(20.0F, 20.0F, 600.0F, 440.0F);
		messages = new List<Message>();
		clients = new Dictionary<string, Client>();
		currentChat = "";
		scrollPosition = new Vector2(0, int.MaxValue);
		
		pubnub = ScriptableObject.CreateInstance<UnityPubNub>();
		
		var url = string.IsNullOrEmpty(Application.srcValue) ? "localhost" : Application.absoluteURL;
		
		pubnub.Init(string.Format("unity.pubnub.{0}", PubNub.Tools.MD5(url)));
		
		StartCoroutine(Chat());
	}
	
	IEnumerator Chat() {
		/*yield return StartCoroutine(pubnub.History(msg => {
			LogMessage(new Message((IDictionary) msg));

			return false;
		}));*/
		
		
		//aquire new message!
		yield return StartCoroutine(pubnub.Subscribe(msg => {
			LogMessage(new Message((IDictionary) msg));
			return true;
		}));
	}

	void OnDisable() {
		PlayerPrefs.SetString("client_id", localClient.id);
		PlayerPrefs.SetString("client_name", localClient.name);

		StopAllCoroutines();
		
		pubnub = null;
	}
	
	bool LogMessage(Message msg) {
		if (!clients.ContainsKey(msg.client)) {
			clients[msg.client] = new Client(msg.client, msg.name, NextColor);
		}

		if (clients[msg.client].name != msg.name) {
			clients[msg.client].name = msg.name;
		}

		if (msg.msg.Trim().Length > 0) {
			if (msg.name.Equals (player_name) == false)
			{
				if (multiplayer!=null)
				multiplayer.onMultiplayerRecieved( msg.name, msg.msg );
				else
					print ("ERROR");
			}
			messages.Add(msg);

			while (messages.Count > 1024) {
				messages.RemoveAt(0);
			}	
		}

		return true;
	}

	public string SendChat(string message) {
		var msg = new Message(message, localClient);

		StartCoroutine(pubnub.Publish(msg.Digest));

		GUI.FocusControl(CHATBOX);

		return "";
	}
	/*
	void OnGUI() {
		if (skin != null) {
			GUI.skin = skin;
		}
		
		windowRect = GUI.Window(666, windowRect, MainWindow, "PubNub Demo");
		
		var focused = GUI.GetNameOfFocusedControl();	
				
		if (focused != CHATBOX && focused != NAMEBOX) {
			GUI.FocusWindow(666);
			GUI.FocusControl(CHATBOX);
		}
	}
	*/
	/*
	void PrintChat() {
		var style = GUI.skin.box;
		style.alignment = TextAnchor.MiddleLeft;

		foreach (var message in messages) {
			var client = message.client;

			GUILayout.BeginHorizontal();

			var prevColor = GUI.color;
			if (message.client == localClient.id) {
				GUILayout.FlexibleSpace();
			} else {
				GUILayout.Label(clients[client].name);
				GUI.color = clients[client].color;
			}
			GUILayout.Box(message.msg, style, GUILayout.MinWidth(150));

			GUI.color = prevColor;
			if (client != localClient.id) {
				GUILayout.FlexibleSpace();
			} else {
				GUILayout.Label("");
			}

			GUILayout.EndHorizontal();

			GUILayout.Space(2);
		}
	}
	*/
	/*

	void MainWindow(int windowID) {
		GUILayout.BeginVertical();

		GUILayout.BeginHorizontal();
		GUILayout.FlexibleSpace();
		GUILayout.Label("name:");
		GUI.SetNextControlName(NAMEBOX);
		localClient.name = GUILayout.TextField(localClient.name, GUILayout.MaxWidth(150));
		if (localClient.name.Length > 24) {
			localClient.name = localClient.name.Substring(0, 24);
		}

		GUILayout.EndHorizontal();

		GUILayout.Space(6);
		
		GUILayout.BeginScrollView(scrollPosition, false, true, GUILayout.Height(340));

		PrintChat();

		GUILayout.EndScrollView();

		GUILayout.BeginHorizontal();
		GUI.SetNextControlName(CHATBOX);
		currentChat = GUILayout.TextField(currentChat);

		if (currentChat.Length > 160) {
			currentChat = currentChat.Substring(0, 160);
		}

		if (GUILayout.Button("Send", GUILayout.Width(70))) {
			if (currentChat.Trim().Length > 0) {
				currentChat = SendChat(currentChat);
			}
		}
		GUILayout.EndHorizontal();

		GUILayout.EndVertical();
				
		var evt = Event.current;
						
		if (evt.type == EventType.KeyUp
			&& (evt.keyCode == KeyCode.Return || evt.keyCode == KeyCode.KeypadEnter)) {
		
			var focused = GUI.GetNameOfFocusedControl();	
					
			if (focused == CHATBOX && currentChat.Trim().Length > 0) {			
				currentChat = SendChat(currentChat);
			} else if (focused == NAMEBOX && localClient.name.Trim().Length > 0) {
				SendChat("");
			}
		}
	}*/
}