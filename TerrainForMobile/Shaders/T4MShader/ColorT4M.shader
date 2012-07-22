Shader "TerrainForMobile/ColorT4M" {
Properties {
	_Color ("Main Color", Color) = (1,1,1,1)
}
SubShader {
	Tags { "RenderType"="Opaque" }
	LOD 200

CGPROGRAM
#pragma surface surf Lambert exclude_path:prepass  noforwardadd halfasview approxview nolightmap

fixed4 _Color;

struct Input {
	float2 _Color;
};

void surf (Input IN, inout SurfaceOutput o) {
	fixed4 c =  _Color;
	o.Albedo = c.rgb;
}
ENDCG
}


Fallback "VertexLit"

}
