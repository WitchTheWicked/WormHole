using UnityEngine;
using System.Collections;

public class TimedDeath : MonoBehaviour {
	
	public int time_living = 3;
	// Use this for initialization
	void Start () {
		Invoke ("die",time_living);
	}
	
	void die()
	{
		Destroy (gameObject);
	}
	// Update is called once per frame
	void Update () {
	
	}
}
