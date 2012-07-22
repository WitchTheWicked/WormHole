using UnityEngine;
using System.Collections;

public class Projectile : MonoBehaviour {
	
	public GameObject portal;
	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}
	
	void OnCollisionEnter( Collision collision )
	{
		if (collision.gameObject.layer == LayerMask.NameToLayer("TargetableLayer"))
		{
			print ("SUCCESS");
			Instantiate (portal,transform.position,transform.rotation);
		}
		Destroy (gameObject);
	}
}
