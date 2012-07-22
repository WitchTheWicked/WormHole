Shader "TerrainForMobile/2TexturesVLMBXSGXGLES1.1" {
Properties {
	_Color ("Main Color", Color) = (1,1,1,1)
	_Layer1 ("Layer1 (RGB)", 2D) = "white" {}
	_Layer2 ("Layer2 (RGB)", 2D) = "white" {}
	_MainTex ("Mask (RGB)", 2D) = "white" {}
}
	SubShader {
	Tags { "RenderType"="Opaque" }
		
	Pass {
	Tags { "LightMode" = "Vertex" }
		Material {
			Diffuse [_Color]
			Ambient [_Color]
		} 
		Lighting On
		
		SetTexture [_Layer1]
		
		SetTexture [_MainTex]
		{
			combine previous, texture
		}
				
		SetTexture [_Layer2]
		{
			combine texture lerp(previous) previous
			
		}
		SetTexture [_Layer1]{
			combine previous * primary DOUBLE	
		}
			
	}	
	}
	
		//MBX Lite
	SubShader {
	Tags { "RenderType"="Opaque" }
	LOD 100
	Material {
			Diffuse [_Color]
			Ambient [_Color]
		} 
        Pass {   
			Tags { "RenderType"="Vertex" }
		
		Lighting On
            
            SetTexture[_Layer1]
            SetTexture[_MainTex] {
            	
            	Combine previous * PRIMARY Double, texture 
            }
        }
        Pass {
		Tags { "RenderType"="Vertex" }
		
		Lighting On
            Blend SrcAlpha OneMinusSrcAlpha
         
            SetTexture[_Layer2]
        
           SetTexture[_MainTex] {
           	 
           	Combine previous * PRIMARY Double, texture 
           	}
        }
		
    }
}
