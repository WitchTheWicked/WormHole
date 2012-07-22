using UnityEngine;
using System.Collections;
public class ScrollingUVs : MonoBehaviour 
{
    
    public Vector2 uvAnimationRateM = new Vector2( -0.011f, 0.0f );
	public Vector2 uvAnimationRateB = new Vector2( -0.011f, 0.0f );

    Vector2 uvOffsetMain = Vector2.zero;
	Vector2 uvOffsetBump = Vector2.zero;
    void LateUpdate() 
    {
        uvOffsetMain += ( uvAnimationRateM * Time.deltaTime );
		uvOffsetBump += ( uvAnimationRateB * Time.deltaTime );
            renderer.materials[ 0 ].SetTextureOffset( "_WaveBump", uvOffsetBump );
			 renderer.materials[ 0 ].SetTextureOffset( "_MainTex", uvOffsetMain );
        
    }
}