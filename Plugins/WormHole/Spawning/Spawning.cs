using UnityEngine;
using System.Collections;

public class Spawning : MonoBehaviour {

	// Use this for initialization
	public GameObject android_spawn;
	public GameObject pc_spawn;
	public GameObject player_object;
	public Transform spawn_position;
	void Start () {
		GameObject old_camera = Camera.mainCamera.gameObject;
		if (Application.platform == RuntimePlatform.Android)
		{
			player_object = (GameObject)Instantiate (android_spawn,spawn_position.position,spawn_position.rotation);
		}
		else
		{
			Screen.showCursor = false;
			player_object  = (GameObject)Instantiate (pc_spawn,spawn_position.position,spawn_position.rotation);
		}
		Destroy (old_camera);
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
