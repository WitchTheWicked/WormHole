using UnityEngine;
using System.Collections;

public class Movement : MonoBehaviour {
	
	public string current_animation = "SMidle1";
	private Animation _animation;
	public string[] ANIMATIONS;
	private int ani_index = 0;
	// Use this for initialization
	
	void Start () {
	_animation = GetComponent<Animation>();
		ANIMATIONS = new string[32];
		ANIMATIONS[0] = "SMidle1";
		ANIMATIONS[1] = "SMrun1";
	}
	
	public void onMoving()
	{
		ani_index = 1;
	}
	public void onStoping()
	{
		ani_index = 0;
	}
	public int getAniIndex()
	{
		return ani_index;
	}
	public const string ANI_IDLE = "SMidle1";
	public const string ANI_RUNNING = "SMrun1";
	
	public void onAnimation( int index )
	{
		ani_index = index;
	}
	// Update is called once per frame
	void Update () {
		//Debug.Log (ANIMATIONS.Length);
		//_animation.Play (ANIMATIONS[ani_index]);
	}
}
