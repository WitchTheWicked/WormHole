Shader "TerrainForMobile/2TexturesMBXSGXUnLitGLES1.1" {
Properties {
	_Color ("Main Color", Color) = (1,1,1,1)
	_Layer1 ("Layer1 (RGB)", 2D) = "white" {}
	_Layer2 ("Layer2 (RGB)", 2D) = "white" {}
	_MainTex ("Mask (RGB)", 2D) = "white" {}
}

//SGX 3GS+
	SubShader {
	Lighting Off	
	Pass {
			
		SetTexture [_Layer1]
		
		SetTexture [_MainTex]
		{
		ConstantColor [_Color]
			combine previous, texture* constant
		}
				
		SetTexture [_Layer2]
		{
			combine texture lerp(previous) previous 
			
		}
		SetTexture [_Layer1]{
		 ConstantColor [_Color]
			combine previous * constant  DOUBLE
		} 
	}	
	}
	
	//MBX Lite
	SubShader {

		Lighting Off
        Pass {      
            
            SetTexture[_Layer1]
            SetTexture[_MainTex] {
            	ConstantColor [_Color]
            	Combine previous * constant DOUBLE, texture 
            }
        }
        Pass {
            Blend SrcAlpha OneMinusSrcAlpha
         
            SetTexture[_Layer2]
        
           SetTexture[_MainTex] {
           	 ConstantColor [_Color]
           	Combine previous * constant DOUBLE, texture 
           	}
        }
    }
}
