using UnityEngine;
using System.Collections;

public class Portal : MonoBehaviour {
	
	public GameObject other_portal;
	private float portal_delay;
	public bool bIgnoreFirst; // this is to prevent the thing from teleing back and forth
	// Use this for initialization
	void Start () {
		GameObject[] gos = GameObject.FindGameObjectsWithTag(this.tag);
		
		foreach( GameObject go in gos)
		{
			if (go.Equals(gameObject) == false)
			{
				Destroy (go);	
			}
		}
		//to set the other portal we just do this
		updatePortalPointer();
		
	
	}
	public void updatePortalPointerSecond()
	{
		if (this.tag == "Portal Right")
			other_portal = GameObject.FindGameObjectWithTag("Portal Left");
		else
			other_portal = GameObject.FindGameObjectWithTag("Portal Right");
		
		bIgnoreFirst = false;
	}
	public void updatePortalPointer()
	{
		if (this.tag == "Portal Right")
			other_portal = GameObject.FindGameObjectWithTag("Portal Left");
		else
			other_portal = GameObject.FindGameObjectWithTag("Portal Right");
		if (other_portal !=null)
			other_portal.GetComponent<Portal>().updatePortalPointerSecond(); //if i called the original, it will be recursive
	}
	
	
	// Update is called once per frame
	void Update () {
	
	}
	
	void OnTriggerEnter(Collider other)
	{
		if (bIgnoreFirst)
		{
			bIgnoreFirst = false;
			return;
		}
		
		if (other_portal !=null)
		{
			if (other.gameObject.tag == "Player")
			{
				other_portal.GetComponent<Portal>().bIgnoreFirst = true;
				other.transform.position = other_portal.transform.position;
			}
		}
	}
}
