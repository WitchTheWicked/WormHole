Shader "TerrainForMobile/3TexturesBumpDiffuseSimple" {
Properties {
	_Color ("Main Color", Color) = (1,1,1,1)
	_Layer1 ("Layer1 (RGB)", 2D) = "white" {}
	_Layer2 ("Layer2 (RGB)", 2D) = "white" {}
	_Layer3 ("Layer3 (RGB)", 2D) = "white" {}
	_BumpLayer1 ("Layer1Normalmap", 2D) = "bump" {}
	_BumpLayer2 ("Layer2Normalmap", 2D) = "bump" {}
	_BumpLayer3 ("Layer3Normalmap", 2D) = "bump" {}
	_MainTex ("Mask (RGB)", 2D) = "white" {}
}

SubShader {
	Tags {
		"SplatCount" = "3"
		"Queue" = "Geometry-100"
		"RenderType" = "Opaque"
	}

CGPROGRAM
#pragma surface surf Lambert exclude_path:prepass noforwardadd  halfasview novertexlights



struct Input {
	float2 uv_Layer1: TEXCOORD0;
	float2 uv_Layer2 : TEXCOORD1;
	float2 uv_Layer3 : TEXCOORD2;
	float2 uv_MainTex : TEXCOORD3;
};
sampler2D _MainTex;
sampler2D _Layer1, _Layer2, _Layer3;
sampler2D _BumpLayer1,_BumpLayer2,_BumpLayer3;
fixed3 _Color;

void surf (Input IN, inout SurfaceOutput o) {
	fixed3 Mask = tex2D (_MainTex, IN.uv_MainTex);
	fixed3 lay;
	fixed3 layB;
	lay  = Mask.r * tex2D (_Layer1, IN.uv_Layer1).rgb;
	lay += Mask.g * tex2D (_Layer2, IN.uv_Layer2).rgb;
	lay += Mask.b * tex2D (_Layer3, IN.uv_Layer3).rgb;
	layB  = Mask.r * UnpackNormal (tex2D(_BumpLayer1, IN.uv_Layer1)).rgb;
	layB += Mask.g * UnpackNormal (tex2D(_BumpLayer2, IN.uv_Layer2)).rgb;
	layB += Mask.b * UnpackNormal (tex2D(_BumpLayer3, IN.uv_Layer3)).rgb;
	o.Albedo = lay.rgb * _Color;
	o.Normal = layB;
	o.Alpha = 0.0;
}
ENDCG  
}

}
