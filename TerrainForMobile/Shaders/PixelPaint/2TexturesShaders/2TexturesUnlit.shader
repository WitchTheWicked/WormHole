Shader "TerrainForMobile/2TexturesUnlit" {
Properties {
   _Color ("Main Color", Color) = (1,1,1,1)
	_Layer1 ("Layer1 (RGB)", 2D) = "white" {}
	_Layer2 ("Layer2 (RGB)", 2D) = "white" {}
	_MainTex ("Mask (RGB)", 2D) = "white" {}
}
SubShader {
    Pass {

		CGPROGRAM
		#pragma vertex vert
		#pragma fragment frag
		#include "UnityCG.cginc"

		float4 _Color;
		sampler2D _Layer1 ;
		sampler2D _Layer2 ;
		sampler2D _MainTex;

		struct v2f {
			float4  pos : SV_POSITION;
			float2  uv[3] : TEXCOORD0;
		};

		float4 _Layer1_ST;
		float4 _Layer2_ST;
		float4 _MainTex_ST;

		v2f vert (appdata_base v)
		{
			v2f o;
			o.pos = mul (UNITY_MATRIX_MVP, v.vertex);
			o.uv[0] = TRANSFORM_TEX (v.texcoord, _Layer1);
			o.uv[1] = TRANSFORM_TEX (v.texcoord, _Layer2);
			o.uv[2] = TRANSFORM_TEX (v.texcoord, _MainTex);
			return o;
		}

		half4 frag (v2f i) : COLOR
		{
			half4 Mask = tex2D( _MainTex, i.uv[2].xy );
			half4 lay1 = tex2D( _Layer1, i.uv[0].xy );
			half4 lay2 = tex2D( _Layer2, i.uv[1].xy );
   				
    		half4 c;
			c.xyz = (lay1.xyz * Mask.r + lay2.xyz * Mask.g) * _Color.rgb * 2;
			c.w = 0;
			return c;
		}
		ENDCG
    }
}
} 