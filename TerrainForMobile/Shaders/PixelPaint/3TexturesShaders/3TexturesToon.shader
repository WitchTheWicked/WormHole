Shader "TerrainForMobile/3TexturesToon" {
	Properties {
		_Color ("Main Color", Color) = (0.5,0.5,0.5,1)
		_Layer1 ("Layer1 (RGB)", 2D) = "white" {}
		_Layer2 ("Layer2 (RGB)", 2D) = "white" {}
		_Layer3 ("Layer3 (RGB)", 2D) = "white" {}
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_Ramp ("Toon Ramp (RGB)", 2D) = "gray" {} 
	}

	SubShader {
		Tags {
		"SplatCount" = "3"
		"Queue" = "Geometry-100"
		"RenderType" = "Opaque"
	}
		
CGPROGRAM
#pragma surface surf ToonRamp exclude_path:prepass  noforwardadd halfasview novertexlights approxview nolightmap

sampler2D _Ramp;

#pragma lighting ToonRamp exclude_path:prepass  noforwardadd halfasview novertexlights approxview nolightmap
inline half4 LightingToonRamp (SurfaceOutput s, half3 lightDir, half atten)
{
	#ifndef USING_DIRECTIONAL_LIGHT
	lightDir = normalize(lightDir);
	#endif
	
	half d = dot (s.Normal, lightDir)*0.5 + 0.5;
	half3 ramp = tex2D (_Ramp, float2(d,d)).rgb;
	
	half4 c;
	c.rgb = s.Albedo * _LightColor0.rgb * ramp * (atten * 2);
	c.a = 0;
	return c;
}

struct Input {
	float2 uv_Layer1: TEXCOORD0;
	float2 uv_Layer2 : TEXCOORD1;
	float2 uv_Layer3 : TEXCOORD2;
	float2 uv_MainTex : TEXCOORD3;
};
sampler2D _MainTex;
fixed3 _Color;
sampler2D _Layer1, _Layer2, _Layer3,_Layer4;
void surf (Input IN, inout SurfaceOutput o) {
	fixed3 Mask = tex2D (_MainTex, IN.uv_MainTex);
	fixed3 lay;
	
	lay  = Mask.r* tex2D (_Layer1, IN.uv_Layer1).rgb;
	lay += Mask.g * tex2D (_Layer2, IN.uv_Layer2).rgb;
	lay += Mask.b * tex2D (_Layer3, IN.uv_Layer3).rgb;
	o.Albedo = lay* _Color.rgb;
	o.Alpha = 0.0;
}
ENDCG

	} 

}
