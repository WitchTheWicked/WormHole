Shader "TerrainForMobile/FakeShadow4Dynamic" {
 	Properties {
		_Transp ("Transparency", Range(0,1)) = 0.5
		_MaskTex ("Base (RGB) Trans (A)", 2D) = "" { TexGen ObjectLinear }
	}
	SubShader {
		Pass {
			Blend SrcAlpha OneMinusSrcAlpha 
		
			Color (0,0,0,[_Transp])
		
			SetTexture [_MaskTex] {
				 combine previous , previous - texture
				Matrix [_Projector]
			} 
		}	
	}
}

