using UnityEngine;
using System.Collections;

public class Multiplayer : MonoBehaviour
{
	public PubNubChat pubNubChat;
	public Spawning spawning;
	public GameObject player;
	public GameObject ally;
	public GameObject projectile_Left;
	public GameObject projectile_Right;
	public Hashtable allies = new Hashtable();
	
	
	public void onMultiplayerRecieved( string name, string msg )
	{
		if (allies.ContainsKey(name) == false)
		{
			GameObject new_thing = (GameObject)Instantiate(ally,spawning.spawn_position.transform.position,spawning.spawn_position.transform.rotation);
			allies.Add (name,new_thing);
		}
		
		if (msg.Contains(pubNubChat.player_name))
		{
			return;
		}
		if (msg.Contains ("pos")) //this is a position message
		{
			print ("Parsing packet from:" + name);
			setAllyPosition(name,msg);
		}
	}
	
	
	IEnumerator  MoveObject (Transform thisTransform, Vector3 startPos, Vector3 endPos, float time) {
    float i = 0.0f;
    float rate = 1.0f/time;
    while (i < 1.0f) {
        i += Time.deltaTime * rate;
        thisTransform.position = Vector3.Lerp(startPos, endPos, i);
        yield return null; 
    }
}
	
	public void setAllyPosition( string name, string msg )
	{
		int start = msg.IndexOf("pos:") + 4;
		string parsed = msg.Substring(start,msg.IndexOf("ani:")-start);
		//print (parsed);
		string[] coordinates = parsed.Split(',');
		GameObject myAlly = (GameObject)allies[name];
		
		Vector3 targetPos = new Vector3(float.Parse(coordinates[0]),float.Parse (coordinates[1]),float.Parse (coordinates[2]));
		Vector3 relativePos = targetPos - myAlly.transform.position;
        Quaternion targetRotation = Quaternion.LookRotation(relativePos);
        myAlly.transform.rotation = targetRotation;
		StartCoroutine(MoveObject(myAlly.transform,myAlly.transform.position,targetPos,0.5f));
		
		start = msg.IndexOf("ani:") + 4;
		parsed = msg.Substring(start,msg.Length - start);
		print ("Animation Recieved State: " + parsed);
		myAlly.GetComponent<Movement>().onAnimation(int.Parse (parsed));
	}
	public string old_player_info;
	public void sendPlayerInfo()
	{
		if (player==null)
		{
			if (spawning.player_object != null)
				player = spawning.player_object;
		}
		else
		{
			string output = pubNubChat.player_name + "pos:" + player.transform.position.x.ToString() + "," + player.transform.position.y.ToString () + "," + player.transform.position.z.ToString () +
				"ani:" + player.GetComponent<Movement>().getAniIndex();
			pubNubChat.SendChat(output);	
			//print ("Sending :" + output);
			
			
		}
	}
	
	// Use this for initialization
	void Start ()
	{
		InvokeRepeating("sendPlayerInfo",0,0.5f);
		
	}
	
	// Update is called once per frame
	void Update ()
	{
		if (Input.GetKeyDown (KeyCode.Mouse0))
		{
			//pubNubChat.SendChat(pubNubChat.player_name + "lport");
			GameObject new_thing;
        	new_thing = (GameObject)Instantiate(projectile_Left, Camera.mainCamera.transform.position, player.transform.rotation);

			print (Camera.mainCamera.transform.rotation);
			new_thing.rigidbody.AddForce(Camera.mainCamera.transform.forward * 2000);
		}
		if (Input.GetKeyDown (KeyCode.Mouse1))
		{
			//pubNubChat.SendChat(pubNubChat.player_name + "rport");
			GameObject new_thing;
        	new_thing = (GameObject)Instantiate(projectile_Right, Camera.mainCamera.transform.position, player.transform.rotation);

			print (Camera.mainCamera.transform.rotation);
			new_thing.rigidbody.AddForce(Camera.mainCamera.transform.forward * 2000);
		}
		
	}
}

