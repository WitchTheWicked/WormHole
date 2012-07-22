Shader "TerrainForMobile/2TexturesLMSGXGLES1.1" {
Properties {
	_Color ("Main Color", Color) = (1,1,1,1)
	_Layer1 ("Layer1 (RGB)", 2D) = "white" {}
	_Layer2 ("Layer2 (RGB)", 2D) = "white" {}
	_MainTex ("Mask (RGB)", 2D) = "white" {}
}
	SubShader {
	Tags { "RenderType"="Opaque" }
	//No LightMap
	
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
	
	Pass {
		Tags { "LightMode" = "VertexLM" }
		
		BindChannels {
			Bind "Vertex", vertex
			Bind "normal", normal
			Bind "texcoord1", texcoord0 // lightmap uses 2nd uv
		}
		
		SetTexture [unity_Lightmap] {
			matrix [unity_LightmapMatrix]
			constantColor [_Color]
			combine texture * constant
		}
	}
	Pass {
		
		Tags { "LightMode" = "VertexLM" }
		 Blend DstColor SrcColor
		
		
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
			combine previous 	, texture 
		} 
	}
	Pass {
		Tags { "LightMode" = "VertexLMRGBM" }
		
		BindChannels {
			Bind "Vertex", vertex
			Bind "normal", normal
			Bind "texcoord1", texcoord0 // lightmap uses 2nd uv
			Bind "texcoord", texcoord1 // main uses 1st uv
		}
		
		SetTexture [unity_Lightmap] {
			matrix [unity_LightmapMatrix]
			combine texture * texture alpha Quad
		}
	}
	Pass {
		// 2nd pass - multiply with _MainTex
		Tags { "LightMode" = "VertexLMRGBM" }
		 Blend DstColor SrcColor
	
		
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
			combine previous , texture 
		} 
	}
	
	}
}
