Shader "TerrainForMobile/WaterT4M" {
Properties {
	_Color ("Main Color", Color) = (1,1,1,1)
	_MainTex ("Base (RGB) Trans (A)", 2D) = "white" {}
	_WaveBump ("Normalmap", 2D) = "bump" {}
}

SubShader {
	Tags {"Queue"="Transparent" "IgnoreProjector"="True" "RenderType"="Transparent"}
	LOD 300
	
CGPROGRAM
#pragma surface surf Lambert exclude_path:prepass  noforwardadd halfasview nolightmap alpha approxview 

sampler2D _MainTex;
sampler2D _WaveBump;
fixed4 _Color;

struct Input {
	float2 uv_MainTex;
	float2 uv_WaveBump;
};

void surf (Input IN, inout SurfaceOutput o) {
	fixed4 c = tex2D(_MainTex, IN.uv_MainTex) * _Color;
	o.Albedo = c.rgb;
	o.Alpha = c.a;
	o.Normal = UnpackNormal(tex2D(_WaveBump, IN.uv_WaveBump));
}
ENDCG
}
FallBack "Transparent/Diffuse"
}