import System.IO;
import System.Text;

class T4M extends EditorWindow {
	
	var initialized = 0;
	static var MTObject : Transform;
	var CurrentSelect : Transform;
	var scrollPosition : Vector2;
	static var MenuToolbar = 0;
	var Menu : GUIContent[] = new GUIContent[5];
	var LayerSelectObj : Texture[];
	var MenuOption : Texture;
	var Menupaint : Texture;
	var MenuPlanting: Texture;
	var MenuConver : Texture;
	var MenuToTM: Texture;
	var MenuCam : Texture;
	var entete : Texture;
	var selTexture : int = 0;
	var oldselTexture : int = 1;
	var TexBrush : Texture[];
	var selBrush : int =0;
	var oldselBrush : int =0;
	var Layer1TX : float;
	var Layer1TY : float;
	var Layer2TX : float;
	var Layer2TY : float;
	var Layer3TX : float;
	var Layer3TY : float;
	var Layer4TX : float;
	var Layer4TY : float;
	var joinTiles : boolean = true;
	static public var targetColor : Color;
	var PreviewBrush = true;
	var oldPreviewBrush;
	var Pinit = 0;
	var brushSize : int = 16;
	static public var Stronger = 0.1;
	static public var tex : Texture2D ;
	static public var BrushSizeInPourcent : int;
	static public var BrushAlpha : float[];
	var TBrush : Texture2D;
	var PreviewTiling : Vector2[] = new Vector2[4];
	var oldPreviewTiling : Vector2[] = new Vector2[4];
	var oldBSize : int;
	var oldLayerSelectObj : Texture[];
	var MeshSize : Vector2;
	var MenuPaintTPM: GUIContent[] = new GUIContent[2];
	static var Size: float= 1;
	static var SizeVar: float= 0;
	static var RandomRot : boolean = true;
	static var CreateCollision : boolean = false;
	static var MenuPaintTP =0;
	static var Static : boolean = true;
	var AddObject : GameObject;
	static var selPObj : int = 0;
	static var PlObjectList = new ArrayList();
	static var PlObjectPreviewList = new ArrayList();
	static var PlObjectPreview : Texture2D[];
	static var GrpName : String = "TreeList1";
	var Layer1 : Texture;
	var Layer2 : Texture;
	var Layer3 : Texture;
	var Layer1N : Texture;
	var Layer2N : Texture;
	var Layer3N : Texture;
	var terrain : TerrainData;
	var TerrainToconvert : Terrain;
	var ObjectToconvert : GameObject;
	var resolutionV : float = 90;
	var tCount : int;
    var counter : int;
    var totalCount : int;
    var progressUpdateInterval = 10000;
	var terrainName = "Terrain";
	var vertexInfo : Mesh;
	var  Child : GameObject;
	var TextureReso = 0;
	var MenuReso  : String[] = ["512x512", "1024x1024","2048x2048"];
	var finalReso : int;
	var NoTx = 0;
	var MenuTexture : String[] = ["4 Diffuses", "3 Diff/Bump","2 Diffuses"];
	var TxType : int;
	static var Preview : Projector;
	 var BrushMask : Texture2D;
	static var oldGroupName : String;
	 var keep : int = 0;
	var BrushExist : boolean = false;
	var oldmenuposition : int;
	var oldTerraintoConv : Terrain;
	var ActiveCamObj : Transform;
	var BgMD : float = 1000;
	var FarMD : float = 500;
	var MiddleMD : float = 200;
	var CloseMD : float = 100;
	var Cam : Camera;
	var oldSelect : Transform;
	var rampTex : Texture;
	var OutlineSize = 0.002;
	var OutlineColor : Color;
	var HeightmapWidth = 0;
	var HeightmapHeight = 0;
	var terrainDat ;
	var tRes =4.1;
	var X : int;
	var Y : int;
	static var YorigineCorrect : float = 0;
	var resolutionVT : int;
	enum LayerObj{
		CloseObjects = 0,
		MiddleObjects = 1,
		FarObjects = 2,
		BackgroundObjects = 3
	}
	static var ObjectLayer = LayerObj.CloseObjects;
	enum EnumGLES{
		OpenGLES2 = 0,
		OpenGLES11 = 1
	}
	static var GLESShader = EnumGLES.OpenGLES2;
	var TResolution : int;
	var ScriptTo : T4MCamera;
	var numberOfTextures = 2;
	var ShaderColor : Color;
	var CurrentShader : Shader;
	var currentShaderTxt = "";
@MenuItem ("Window/Terrain 4 Mobile System %t")
	static function Init () {
		var window : T4M = EditorWindow.GetWindowWithRect(T4M,new Rect(0,0,320,620));
	}
	function OnInspectorUpdate() {
              Repaint();
    } 
	
	function DestroyPreviewB (){
	
		var projectorObj : Projector[]= FindObjectsOfType(Projector) as Projector[];
			var length = projectorObj.Length;
			for (var i = 0; i < length; i++)
			{
					if (projectorObj[i].gameObject.name == "Preview")
					DestroyImmediate (projectorObj[i].gameObject);
			}
	}
	
	
	
	 function OnDestroy() {
        MTObject = null;
		tex = null;
		BrushAlpha = null;
		MenuToolbar = 0;
		DestroyPreviewB ();
    }
	
	function GUInitialisation(){
		DestroyPreviewB ();
		entete=Resources.LoadAssetAtPath("Assets/TerrainForMobile/Ico/T2M.jpg", typeof(Texture));
		MenuConver=Resources.LoadAssetAtPath("Assets/TerrainForMobile/Ico/UTtoT4M.png", typeof(Texture));
		MenuOption=Resources.LoadAssetAtPath("Assets/TerrainForMobile/Ico/option.png", typeof(Texture));
		Menupaint=Resources.LoadAssetAtPath("Assets/TerrainForMobile/Ico/paint.png", typeof(Texture));
		MenuPlanting=Resources.LoadAssetAtPath("Assets/TerrainForMobile/Ico/tree.png", typeof(Texture));
		MenuCam=Resources.LoadAssetAtPath("Assets/TerrainForMobile/Ico/cam.png", typeof(Texture));
		MenuFollow=Resources.LoadAssetAtPath("Assets/TerrainForMobile/Ico/followT.png", typeof(Texture));
		MenuNoFollow=Resources.LoadAssetAtPath("Assets/TerrainForMobile/Ico/NofollowT.png", typeof(Texture));
		Menu[0] = new GUIContent(MenuConver);
		Menu[1] = new GUIContent(MenuOption);
		Menu[2] = new GUIContent(Menupaint);
		Menu[3] = new GUIContent(MenuPlanting);
		Menu[4] = new GUIContent(MenuCam);
	
		
		MenuPaintTPM[0] = new GUIContent(MenuNoFollow);
		MenuPaintTPM[1] = new GUIContent(MenuFollow);
		
		var BrushList = new ArrayList ();
		var BrushesTL;
		var BrushNum = 0;
		do {
			BrushesTL = Resources.LoadAssetAtPath ("Assets/TerrainForMobile/Brushes/Brush"+BrushNum+".png", typeof(Texture));
			if (BrushesTL){
			BrushList.Add (BrushesTL);
			}
			BrushNum++;
		}while (BrushesTL);
		
		TexBrush = BrushList.ToArray(typeof(Texture)) as Texture[];
		
		initialized = 1;
	}

		
	function OnGUI () 
	{
		if (initialized == 0)
			GUInitialisation();
		
		CurrentSelect= Selection.activeTransform;
		
		if (keep == 1 && ((MenuToolbar == 1 || MenuToolbar == 2 || MenuToolbar ==3 || MenuToolbar ==4) || oldTerraintoConv != TerrainToconvert)){
			DestroyImmediate(oldTerraintoConv.gameObject);
			TerrainToconvert= null;
			vertexInfo = null;
			keep = 0;
			terrainDat = null;
		}	
			   
		if (CurrentSelect != null ){
		
				if (CurrentSelect.GetComponent (Terrain) )
					TerrainToconvert = CurrentSelect.GetComponent (Terrain);
				else {
					TerrainToconvert = null;
					terrainDat = null;
				}
				if (CurrentSelect.renderer && !CurrentSelect.GetComponent (Terrain) && CurrentSelect.renderer.sharedMaterial  && !CurrentSelect.GetComponent (T4MObject)){
					ObjectToconvert = CurrentSelect.gameObject;
				}else ObjectToconvert = null;

				if (MTObject != CurrentSelect || CurrentSelect.renderer && CurrentSelect.renderer.sharedMaterial && CurrentShader != CurrentSelect.renderer.sharedMaterial.shader && !CurrentSelect.GetComponent (Terrain)){
					if (CurrentSelect.renderer && CurrentSelect.renderer.sharedMaterial && CurrentSelect.GetComponent (T4MObject)){
							//Updade 1.2 Process
						if (CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/Diffuse"))
							CurrentSelect.renderer.sharedMaterial.shader = Shader.Find ("TerrainForMobile/4TexturesDiffuseFast");
						else if (CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/Diffuse 3 Textures"))
							CurrentSelect.renderer.sharedMaterial.shader = Shader.Find ("TerrainForMobile/3TexturesDiffuseFast");
						else if (CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/DiffuseBumpedSpec") || CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/DiffuseBumped"))
							CurrentSelect.renderer.sharedMaterial.shader = Shader.Find ("TerrainForMobile/3TexturesBumpDiffuseFast");
						
						//
						CurrentShader = CurrentSelect.renderer.sharedMaterial.shader;
						if ((CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/4TexturesDiffuseFast") || CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/3TexturesDiffuseFast")||
		CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesDiffuseFast")||CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/4TexturesDiffuseFastest")||
		CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/3TexturesDiffuseFastest")||CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesDiffuseFastest")
		||CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/4TexturesDiffuseSimple")||CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/3TexturesDiffuseSimple")
		||CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesDiffuseSimple")||CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/3TexturesBumpDiffuseFast")
		||CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/3TexturesBumpDiffuseFastest")||CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/3TexturesBumpDiffuseSimple") 
		|| CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/4TexturesToon")|| CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/4TexturesToonoutline")|| CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/4TexturesUnlit")
		|| CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesToon")|| CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesToonoutline")|| CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesUnlit")
		|| CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/3TexturesToon")|| CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/3TexturesToonoutline")|| CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/3TexturesUnlit")
		|| CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesVLMBXSGXGLES1.1")|| CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesMBXSGXUnLitGLES1.1")|| CurrentSelect.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesLMSGXGLES1.1"))&& CurrentSelect.renderer.sharedMaterial.GetTexture("_MainTex")){
						MTObject = CurrentSelect.transform;
						
						ShaderUpdt ();
						EditorUtility.SetSelectedWireframeHidden(MTObject.renderer, true);
						selTexture = 0;
						selBrush =0;
						Pinit = 0;
						}else CurrentSelect.renderer.sharedMaterial.shader = Shader.Find ("TerrainForMobile/4TexturesDiffuseFast");
					}else {
				 MTObject = null;
				
				}
				}
				
				if (CurrentSelect.GetComponent (Camera)){
					ActiveCamObj = CurrentSelect.transform;
					Cam = ActiveCamObj.camera;
					if (ActiveCamObj.gameObject.GetComponent("T4MCamera")){
						var ScriptG : T4MCamera = ActiveCamObj.gameObject.GetComponent("T4MCamera");
						BgMD =ScriptG.BackgroundMaxDistance;
						FarMD =ScriptG.FarMaxDistance;
						MiddleMD =ScriptG.MiddleMaxDistance;
						CloseMD =ScriptG.CloseMaxDistance;
						ScriptTo= null;
					}
				}else {
						ActiveCamObj = null;
						Cam = null;
					}
			
		}else{
			TerrainToconvert = null;
			MTObject = null;
			ObjectToconvert= null;
			ActiveCamObj = null;
			Cam = null;
			oldSelect = null;
			DestroyPreviewB ();
			
		}
		if (oldmenuposition != MenuToolbar){
			if (!BrushExist && MenuToolbar ==2  && MTObject != null){
						PaintInit ();
						BrushExist = true;
			}else {
					DestroyPreviewB ();
					BrushExist = false;	
			}
			oldmenuposition = MenuToolbar;
		}
		GUILayout.BeginHorizontal();
		GUILayout.FlexibleSpace();
		GUILayout.Label(entete);
		GUILayout.FlexibleSpace();
		GUILayout.EndHorizontal();
		GUILayout.BeginHorizontal();
		GUILayout.FlexibleSpace();
		MenuToolbar = GUILayout.Toolbar(MenuToolbar, Menu, GUILayout.Width(290), GUILayout.Height(30));
		GUILayout.FlexibleSpace();
		GUILayout.EndHorizontal();
		scrollPosition = GUILayout.BeginScrollView (scrollPosition, GUILayout.Width (320), GUILayout.Height (480));
        switch (MenuToolbar)
        {
            case 0:
				GUILayout.Label("Change GLES2 Shader --> GLES 1.1 Shader", EditorStyles.boldLabel);
				if (MTObject !=null  && CurrentSelect.gameObject.GetComponent ("T4MObject")&&!(MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesVLMBXSGXGLES1.1")|| MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesMBXSGXUnLitGLES1.1")|| MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesLMSGXGLES1.1")))
				{	
						ChangeOpenGles();
				}else{
				
						GUILayout.BeginVertical("Box");
						GUILayout.Label("Select a Terrain4Mobile OpenGLES2 First");
						GUILayout.EndVertical();
				}
				
				GUILayout.Label("Unity Terrain To T4M", EditorStyles.boldLabel);
				ConvertMenu();
				EditorGUILayout.Space();
				GUILayout.Label("Object To T4M", EditorStyles.boldLabel);
				GUILayout.BeginVertical("Box");
				if (ObjectToconvert !=null){
					ObjectToT4M();
				}else GUILayout.Label("Select 3D Object First");
				GUILayout.EndVertical();
				break;
				
			case 1: 
			
				if (MTObject !=null  && CurrentSelect.gameObject.GetComponent ("T4MObject")){
					if (!(MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesVLMBXSGXGLES1.1")|| MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesMBXSGXUnLitGLES1.1")|| MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesLMSGXGLES1.1")))
						ChangeT4MShader();
					EditorGUILayout.Space();
					Options();
				}else{
					GUILayout.Label("T4M Options", EditorStyles.boldLabel);
					GUILayout.BeginVertical("Box");
					GUILayout.Label("Select a Terrain4Mobile First");
					GUILayout.EndVertical();
				 }
				 break;
				 
            case 2:
				if (MTObject !=null  && CurrentSelect.gameObject.GetComponent ("T4MObject")){
					PaintingMenu();
				}else{
					GUILayout.Label("T4M Painting", EditorStyles.boldLabel);
					GUILayout.BeginVertical("Box");
					GUILayout.Label("Select a Terrain4Mobile First");
					GUILayout.EndVertical();
					}
				break;
				
			 case 3:
				if (MTObject !=null  && CurrentSelect.gameObject.GetComponent ("T4MObject")){
					Planting();
				}else {
					GUILayout.Label("T4M Planting", EditorStyles.boldLabel);
					GUILayout.BeginVertical("Box");
					GUILayout.Label("Select a Terrain4Mobile First");
					GUILayout.EndVertical();
					}
					break;
				 
			 case 4:
				GUILayout.Label("Camera", EditorStyles.boldLabel);
				GUILayout.BeginVertical("Box");
				if (ActiveCamObj){
					CamSetup();
				}else{
					GUILayout.Label("Select a Camera First");
				}
				GUILayout.EndVertical();
				
		
				
				break;
		}
		GUILayout.EndScrollView ();
	//	if (MenuToolbar == 2 && MTObject  && CurrentSelect.gameObject.GetComponent ("T4MObject"))
//			SaveTexture();
//		else
	//	if (MenuToolbar == 3 && MTObject  && CurrentSelect.gameObject.GetComponent ("T4MObject")){
		
	//	}
	
	}

	
	function ChangeT4MShader (){
		
		GUILayout.Label("Change Number of Textures", EditorStyles.boldLabel);
		
		GUILayout.BeginVertical("Box");	
		if(GUILayout.Button ("Change to 2 Textures Shader")) {
			CurrentSelect.renderer.sharedMaterial.shader = Shader.Find ("TerrainForMobile/2TexturesDiffuseFast");
			MTObject.renderer.sharedMaterial.SetColor("_Color", Color(1,1,1,1));
			ShaderUpdt ();
			selTexture = 0;
			selBrush =0;
			Pinit = 0;
		}
		if(GUILayout.Button ("Change to 3 Textures Shader")) {
			CurrentSelect.renderer.sharedMaterial.shader = Shader.Find ("TerrainForMobile/3TexturesDiffuseFast");
			MTObject.renderer.sharedMaterial.SetColor("_Color", Color(1,1,1,1));
			ShaderUpdt ();
			selTexture = 0;
			selBrush =0;
			Pinit = 0;
		}
		if(GUILayout.Button ("Change to 4 Textures Shader")) {
			CurrentSelect.renderer.sharedMaterial.shader = Shader.Find ("TerrainForMobile/4TexturesDiffuseFast");
			MTObject.renderer.sharedMaterial.SetColor("_Color", Color(1,1,1,1));
			ShaderUpdt ();
			selTexture = 0;
			selBrush =0;
			Pinit = 0;
		}
		GUILayout.EndVertical();
	}
	
	function CamSetup(){
		if (CurrentSelect.GetComponent (T4MCamera)){
			if(GUILayout.Button ("Remove T4MLayerManager")) {
				var Script : T4MCamera = ActiveCamObj.gameObject.GetComponent("T4MCamera");
				DestroyImmediate (Script);
			}
			EditorGUILayout.Space();
			EditorGUILayout.Space();
		
			if (!ScriptTo)
				ScriptTo = ActiveCamObj.gameObject.GetComponent("T4MCamera");
		
				CloseMD = EditorGUILayout.Slider("Close Max Dist :",CloseMD,0,1000);
				EditorGUILayout.Space();
				MiddleMD = EditorGUILayout.Slider("Middle Max Dist :",MiddleMD,0,1000);
				EditorGUILayout.Space();
				FarMD = EditorGUILayout.Slider("Far Max Dist :",FarMD,0,1000);
				EditorGUILayout.Space();
				BgMD = EditorGUILayout.Slider("BG Max Dist :",BgMD,0,10000);
			if (ScriptTo){
				ScriptTo.CloseMaxDistance = CloseMD;
				ScriptTo.MiddleMaxDistance = MiddleMD;
				ScriptTo.FarMaxDistance = FarMD;
				ScriptTo.BackgroundMaxDistance = BgMD;
				ScriptTo.Start ();
			}
		}else if(GUILayout.Button ("Add T4MLayerManager")) {
				ActiveCamObj.gameObject.AddComponent("T4MCamera");
		}
	}
 
	function PaintInit (){
		DestroyPreviewB ();
		var ProjectorB = new GameObject ("Preview");
		ProjectorB.AddComponent(typeof(Projector));
		ProjectorB.hideFlags = HideFlags.HideInHierarchy;
		Preview= ProjectorB.GetComponent(typeof(Projector)) as Projector;
		var SizeOfGeo = MTObject.GetComponent(MeshFilter);
		MeshSize = Vector2(SizeOfGeo.sharedMesh.bounds.size.x,SizeOfGeo.sharedMesh.bounds.size.z);
		Preview.nearClipPlane = -50;
        Preview.farClipPlane = 50;
        Preview.orthographic = true;
        Preview.orthographicSize = 10f;
        Preview.transform.Rotate(-90, 90, -180);
		var NewPMat : Material = new Material ("Shader \"Hidden/PreviewT4M\" { \n	Properties {\n _Transp (\"Transparency\", Range(0,1)) = 1 \n	_MainTex (\"Base\", 2D) = \"black\" { }\n	_MaskTex (\"Base (RGB) Trans (A)\", 2D) = \"\" { TexGen ObjectLinear }\n	}\nSubShader {\n Pass {\nBlend SrcAlpha OneMinusSrcAlpha  \n SetTexture [_MainTex] {\n constantColor (1,1,1,[_Transp]) \n combine texture * constant	}\n SetTexture [_MaskTex] {\n	combine previous , previous * texture\n	Matrix [_Projector]\n	}\n}\n}\n}");
		Preview.material = NewPMat;
		tex = MTObject.renderer.sharedMaterial.GetTexture("_MainTex");
		var Lay1 : Vector2 = MTObject.renderer.sharedMaterial.GetTextureScale("_Layer1");
		var Lay2 : Vector2 = MTObject.renderer.sharedMaterial.GetTextureScale("_Layer2");
		var Lay3 : Vector2; 
		if (numberOfTextures > 2)
			Lay3= MTObject.renderer.sharedMaterial.GetTextureScale("_Layer3");
		var Lay4 : Vector2;
		if (numberOfTextures == 4)
			Lay4  = MTObject.renderer.sharedMaterial.GetTextureScale("_Layer4");
			
		Layer1TX = Lay1.x;
		Layer1TY = Lay1.y;
		Layer2TX=Lay2.x;
		Layer2TY = Lay2.y;
		Layer3TX = Lay3.x;
		Layer3TY = Lay3.y;
		Layer4TX = Lay4.x;
		Layer4TY = Lay4.y;
		if (Layer1TX !=Layer1TY || Layer2TX != Layer2TY || Layer3TX != Layer3TY || Layer4TX != Layer4TY)
			joinTiles = false;
		Pinit = 1;
		InitBrush();
		
	}
	///
	
	function PaintingMenu(){
		
	
		if (Preview && oldPreviewBrush !=PreviewBrush){
			Preview.enabled = PreviewBrush;
			oldPreviewBrush =PreviewBrush;
		}
		
		if (Pinit == 0)
			PaintInit ();
		
		if (oldBSize != brushSize || oldselBrush != selBrush || oldselTexture != selTexture){
			InitBrush();
			oldBSize = brushSize;
			oldselBrush = selBrush;
			oldselTexture = selTexture;
		}	
		
		GUILayout.Label("Brushes", EditorStyles.boldLabel);
		GUILayout.BeginHorizontal("box");
		GUILayout.FlexibleSpace();
		selBrush= GUILayout.SelectionGrid (selBrush, TexBrush, 10,"gridlist", GUILayout.Width(290), GUILayout.Height(54));
		GUILayout.FlexibleSpace();
		GUILayout.EndHorizontal();
		
		EditorGUILayout.Space();
		GUILayout.Label("Textures", EditorStyles.boldLabel);
		GUILayout.BeginHorizontal("box");
		GUILayout.FlexibleSpace();
		
		selTexture = GUILayout.SelectionGrid (selTexture, LayerSelectObj, 4,"gridlist", GUILayout.Width(290), GUILayout.Height(74));
		GUILayout.FlexibleSpace();
		 GUILayout.EndHorizontal();
		 EditorGUILayout.Space();
		GUILayout.Label("Settings", EditorStyles.boldLabel);
		GUILayout.BeginVertical("box");
		brushSize = EditorGUILayout.Slider("Brush Size",brushSize,1,36);
		EditorGUILayout.Space();
		Stronger = EditorGUILayout.Slider("Brush Stronger",Stronger,0.01,0.5);
		GUILayout.EndVertical();
		EditorGUILayout.Space();
		GUILayout.BeginVertical("box");
		GUILayout.BeginHorizontal();
		PreviewBrush= EditorGUILayout.Toggle ("Brush Preview ", PreviewBrush, GUILayout.Width(125));
		ShaderColor =EditorGUILayout.ColorField("Shader Color", ShaderColor);
		MTObject.renderer.sharedMaterial.SetColor("_Color", ShaderColor);
		GUILayout.EndHorizontal();
		
		if (MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/4TexturesToonoutline")|| MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesToonoutline") || MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/3TexturesToonoutline")){
			EditorGUILayout.Space();
			OutlineSize = EditorGUILayout.Slider("Outline width",OutlineSize,0.002, 0.03);
			MTObject.renderer.sharedMaterial.SetFloat( "_Outline", OutlineSize );
			EditorGUILayout.Space();
			OutlineColor =EditorGUILayout.ColorField("Outline Color", OutlineColor);
			MTObject.renderer.sharedMaterial.SetColor("_OutlineColor", OutlineColor);
		}
		GUILayout.EndVertical();
		EditorGUILayout.Space();
		GUILayout.BeginVertical("box");
			joinTiles = EditorGUILayout.Toggle ("Join X/Y Tiling ", joinTiles);
			EditorGUILayout.Space();
			if (joinTiles){
				Layer1TY = Layer1TX = EditorGUILayout.Slider("Layer1 Tiling :",Layer1TX,1,500);
				MTObject.renderer.sharedMaterial.SetTextureScale ("_Layer1", Vector2(Layer1TX,Layer1TY));
				EditorGUILayout.Space();
				Layer2TY = Layer2TX = EditorGUILayout.Slider("Layer2 Tiling :",Layer2TX,1,500);
				MTObject.renderer.sharedMaterial.SetTextureScale ("_Layer2", Vector2(Layer2TX,Layer2TY));
				EditorGUILayout.Space();
				if (numberOfTextures > 2){
				Layer3TY = Layer3TX = EditorGUILayout.Slider("Layer3 Tiling :",Layer3TX,1,500);
				MTObject.renderer.sharedMaterial.SetTextureScale ("_Layer3", Vector2(Layer3TX,Layer3TY));
				}
				EditorGUILayout.Space();
				if (numberOfTextures == 4){
				Layer4TY = Layer4TX = EditorGUILayout.Slider("Layer4 Tiling :",Layer4TX,1,500);
				MTObject.renderer.sharedMaterial.SetTextureScale ("_Layer4", Vector2(Layer4TX,Layer4TY));
				}
			}else{
				Layer1TX = EditorGUILayout.Slider("Layer1 TilingX :",Layer1TX,1,500);
				Layer1TY = EditorGUILayout.Slider("Layer1 TilingZ :",Layer1TY,1,500);
				MTObject.renderer.sharedMaterial.SetTextureScale ("_Layer1", Vector2(Layer1TX,Layer1TY));
				EditorGUILayout.Space();
				Layer2TX = EditorGUILayout.Slider("Layer2 TilingX :",Layer2TX,1,500);
				Layer2TY = EditorGUILayout.Slider("Layer2 TilingZ :",Layer2TY,1,500);
				MTObject.renderer.sharedMaterial.SetTextureScale ("_Layer2", Vector2(Layer2TX,Layer2TY));
				EditorGUILayout.Space();
				if (numberOfTextures > 2){
				Layer3TX = EditorGUILayout.Slider("Layer3 TilingX :",Layer3TX,1,500);
				Layer3TY = EditorGUILayout.Slider("Layer3 TilingZ :",Layer3TY,1,500);
				MTObject.renderer.sharedMaterial.SetTextureScale ("_Layer3", Vector2(Layer3TX,Layer3TY));
				}
				EditorGUILayout.Space();
				if (numberOfTextures == 4){
				Layer4TX = EditorGUILayout.Slider("Layer4 TilingX :",Layer4TX,1,500);
				Layer4TY = EditorGUILayout.Slider("Layer4 TilingZ :",Layer4TY,1,500);
				MTObject.renderer.sharedMaterial.SetTextureScale ("_Layer4", Vector2(Layer4TX,Layer4TY));
				}
			}
			GUILayout.EndVertical();
			PreviewTiling[0] = Vector2 (Layer1TX,Layer1TY);
			PreviewTiling[1] = Vector2 (Layer2TX,Layer2TY);
			PreviewTiling[2] = Vector2 (Layer3TX,Layer3TY);
			PreviewTiling[3] = Vector2 (Layer4TX,Layer4TY);
			//	Preview.material.SetFloat("_Transp", Stronger+0.4);
			if (oldPreviewTiling[0] !=  PreviewTiling[0] || oldPreviewTiling[1] !=  PreviewTiling[1] ||  oldPreviewTiling[2] !=  PreviewTiling[2] ||  oldPreviewTiling[3] !=  PreviewTiling[3] || oldLayerSelectObj != LayerSelectObj){
				oldPreviewTiling[0] =PreviewTiling[0] ;
				oldPreviewTiling[1] =PreviewTiling[1] ;
				oldPreviewTiling[2] =PreviewTiling[2] ;
				oldPreviewTiling[3] =PreviewTiling[3] ;
				oldLayerSelectObj = LayerSelectObj;
				InitBrush();
				
			}		
	}
	static function SaveTexture(){
	//		if(GUILayout.Button ("Save the Texture Coordinate", GUILayout.Height(35))) {
				var path = AssetDatabase.GetAssetPath (tex);
				var bytes   = tex.EncodeToPNG ();
				File.WriteAllBytes (path, bytes);
				AssetDatabase.Refresh ();
		// }
		
	}
	function ShaderUpdt (){
		ShaderColor = MTObject.renderer.sharedMaterial.GetColor("_Color");
		if (MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/4TexturesDiffuseSimple") || MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/4TexturesDiffuseFastest") || MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/4TexturesDiffuseFast")|| MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/4TexturesToon")|| MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/4TexturesToonoutline")|| MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/4TexturesUnlit")){
			LayerSelectObj= new Texture[4];
			LayerSelectObj[0] =MTObject.renderer.sharedMaterial.GetTexture("_Layer1");
			LayerSelectObj[1] =MTObject.renderer.sharedMaterial.GetTexture("_Layer2");
			LayerSelectObj[2] =MTObject.renderer.sharedMaterial.GetTexture("_Layer3");
			LayerSelectObj[3] =MTObject.renderer.sharedMaterial.GetTexture("_Layer4");
			numberOfTextures = 4;
		}else if (MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesDiffuseSimple") || MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesDiffuseFastest") || MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesDiffuseFast")|| MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesToon")|| MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesToonoutline")|| MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesUnlit")|| MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesVLMBXSGXGLES1.1")|| MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesMBXSGXUnLitGLES1.1")|| MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesLMSGXGLES1.1")){
			LayerSelectObj= new Texture[2];
			LayerSelectObj[0] =MTObject.renderer.sharedMaterial.GetTexture("_Layer1");
			LayerSelectObj[1] =MTObject.renderer.sharedMaterial.GetTexture("_Layer2");
			numberOfTextures = 2;
		}else{
			LayerSelectObj= new Texture[3];
			LayerSelectObj[0] =MTObject.renderer.sharedMaterial.GetTexture("_Layer1");
			LayerSelectObj[1] =MTObject.renderer.sharedMaterial.GetTexture("_Layer2");
			LayerSelectObj[2] =MTObject.renderer.sharedMaterial.GetTexture("_Layer3");
			numberOfTextures = 3;
		}
		if (MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/4TexturesToonoutline")||MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesToonoutline")||MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/3TexturesToonoutline")){
				OutlineSize = MTObject.renderer.sharedMaterial.GetFloat( "_Outline");
				OutlineColor =MTObject.renderer.sharedMaterial.GetColor("_OutlineColor");
		}
			
	}
	
	function InitBrush(){
			ShaderUpdt ();
		if (!(MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesVLMBXSGXGLES1.1")|| MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesMBXSGXUnLitGLES1.1")|| MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesLMSGXGLES1.1"))){	
			if (selTexture == 0)
				targetColor  = Color(1, 0, 0, 0);
			else if (selTexture == 1)
				targetColor  = Color(0, 1, 0, 0);
			else if (selTexture == 2)
				targetColor  = Color(0, 0, 1, 0);
			else if (selTexture == 3)
				targetColor  = Color(0, 0, 0, 1);
		}else{
			if (selTexture == 0)
				targetColor  = Color(1, 1, 1, 0);
			else if (selTexture == 1)
				targetColor  = Color(0, 0, 0, 1);
		}
		
		
		TBrush = TexBrush[selBrush];
		BrushSizeInPourcent = Mathf.Round ((brushSize*tex.width)/100);
	
		BrushAlpha = new float[BrushSizeInPourcent * BrushSizeInPourcent];
		for( var i :float = 0; i < BrushSizeInPourcent; i++ ) {
			for( var j :float= 0;j < BrushSizeInPourcent; j++ ) {
				BrushAlpha[i * BrushSizeInPourcent + j] = TBrush.GetPixelBilinear(i / BrushSizeInPourcent, j /BrushSizeInPourcent).a;
			}
		}
		
		var BrushAlphaP = new float[64 * 64];
		var MaskB = new Color[64 *64];
		BrushMask = new Texture2D(64, 64, TextureFormat.Alpha8, false);
		BrushMask.wrapMode = TextureWrapMode.Clamp;
		
		for( var k :float  = 0; k < 64; k++ ) {
			for( var l :float = 0;l < 64; l++ ) {
				var RangeT = k * 64 + l;
				BrushAlphaP[RangeT] = TBrush.GetPixelBilinear(k/64, l/64).a *2;
				MaskB[RangeT] = new Color(1,1, 1, BrushAlphaP[RangeT]);
			}
		}
		
        BrushMask.SetPixels(0,0, 64, 64, MaskB, 0);
        BrushMask.Apply();
		Preview.material.SetTexture("_MainTex", LayerSelectObj[selTexture]);
		Preview.material.SetTextureScale ("_MainTex", PreviewTiling[selTexture]);
		Preview.material.SetTexture("_MaskTex", BrushMask);
		Preview.orthographicSize = (brushSize* MTObject.localScale.x)*(MeshSize.x/200);
	
	} 

//Planting
	function Planting(){
	
		GUILayout.Label("Objects", EditorStyles.boldLabel);
		GUILayout.BeginHorizontal("box", GUILayout.Height(82));
		GUILayout.FlexibleSpace();
		if (PlObjectPreview != null && PlObjectPreview.Length >0)
			selPObj= GUILayout.SelectionGrid (selPObj, PlObjectPreview, 4, "gridlist",GUILayout.Width(290), GUILayout.Height(75));
		else GUILayout.Label("No Object found", EditorStyles.boldLabel);
		GUILayout.FlexibleSpace();
		GUILayout.EndHorizontal();
		  GUILayout.BeginVertical("box", GUILayout.Height(35) );
		
		AddObject = EditorGUILayout.ObjectField("Object to Add",AddObject, typeof(GameObject),true);
		 GUILayout.BeginHorizontal();
		
		
		if(GUILayout.Button ("Add to List", GUILayout.Width (105), GUILayout.Height(20))) {
			
			if (PlObjectList.Count <4 && AddObject){
				PlObjectList.Add(AddObject);
				PlObjectPreviewList.Add (EditorUtility.GetAssetPreview(AddObject));
				PlObjectPreview = PlObjectPreviewList.ToArray (typeof(Texture2D)) as Texture2D[];
				selPObj=0;
			}
		}
		GUILayout.FlexibleSpace();
		if(GUILayout.Button ("Delete from List", GUILayout.Width (105), GUILayout.Height(20))) {
			if (PlObjectList.Count >0){
				PlObjectList.RemoveAt(selPObj);
				PlObjectPreviewList.RemoveAt(selPObj);			
				PlObjectPreview = PlObjectPreviewList.ToArray (typeof(Texture2D)) as Texture2D[];
				selPObj=0;
			}
		}
		GUILayout.EndHorizontal();
		GUILayout.EndVertical();
		EditorGUILayout.Space();
		
        GUILayout.Label("Settings", EditorStyles.boldLabel);
	
		GUILayout.BeginHorizontal();
		GUILayout.FlexibleSpace();
		MenuPaintTP = GUILayout.Toolbar(MenuPaintTP, MenuPaintTPM, GUILayout.Width(115), GUILayout.Height(25));
		GUILayout.FlexibleSpace();
		GUILayout.EndHorizontal();
		EditorGUILayout.Space();
		GUILayout.BeginVertical("box");
		
		Size = EditorGUILayout.Slider("Size :",Size,1,50);
		EditorGUILayout.Space();
		SizeVar = EditorGUILayout.Slider("Size Var:",SizeVar,0,50);
		EditorGUILayout.Space();
		YorigineCorrect =EditorGUILayout.Slider("Y Origin :",YorigineCorrect,-5,5);
		EditorGUILayout.Space();
		ObjectLayer = EditorGUILayout.EnumPopup ("Distance",ObjectLayer, GUILayout.Width(225));
		EditorGUILayout.Space();
		GUILayout.BeginHorizontal();
		GUILayout.Label("Group Name");
		GrpName = GUILayout.TextField (GrpName, 20, GUILayout.Width(95));
		GUILayout.EndHorizontal();
		EditorGUILayout.Space();
		
		
		EditorGUILayout.Space();
		GUILayout.BeginHorizontal();
		CreateCollision = EditorGUILayout.Toggle ("Create Collider ", CreateCollision, GUILayout.Width(150));
		GUILayout.FlexibleSpace();
		Static = EditorGUILayout.Toggle ("Is Static ", Static, GUILayout.Width(125));
			
		GUILayout.EndHorizontal();
		EditorGUILayout.Space();
		if (MenuPaintTP == 0)
			RandomRot = EditorGUILayout.Toggle ("Random Rotat.   ", RandomRot, GUILayout.Width(120));
		
			GUILayout.EndVertical();
			GUILayout.FlexibleSpace();

    }
	///
	function Options(){
				
				GUILayout.Label("Shader Type", EditorStyles.boldLabel);
				
				GUILayout.BeginVertical("Box");
			if (numberOfTextures == 4){
				GUILayout.BeginHorizontal();
				if(GUILayout.Button ("Fastest")) {
					MTObject.renderer.sharedMaterial.shader=  Shader.Find ("TerrainForMobile/4TexturesDiffuseFastest");
					MTObject.renderer.sharedMaterial.SetColor("_Color", Color(1,1,1,1));
					currentShaderTxt = "Fastest";
				}
				if(GUILayout.Button ("Fast")) {
					MTObject.renderer.sharedMaterial.shader = Shader.Find ("TerrainForMobile/4TexturesDiffuseFast");
					MTObject.renderer.sharedMaterial.SetColor("_Color", Color(1,1,1,1));
					currentShaderTxt = "Fast";
				}
				if(GUILayout.Button ("Simple")) {
					MTObject.renderer.sharedMaterial.shader = Shader.Find ("TerrainForMobile/4TexturesDiffuseSimple");
					MTObject.renderer.sharedMaterial.SetColor("_Color", Color(1,1,1,1));
					currentShaderTxt = "Simple";
				}
				GUILayout.EndHorizontal();
				GUILayout.BeginHorizontal();
				if(GUILayout.Button ("Toon")) {
					MTObject.renderer.sharedMaterial.shader=  Shader.Find ("TerrainForMobile/4TexturesToon");
					MTObject.renderer.sharedMaterial.SetColor("_Color", Color(1,1,1,1));
					rampTex = Resources.LoadAssetAtPath("Assets/TerrainForMobile/Shaders/ToonBase/toon ramp.png", Texture);
					MTObject.renderer.sharedMaterial.SetTexture("_Ramp", rampTex);
					currentShaderTxt = "Toon Light";
				}
			/*	if(GUILayout.Button ("ToonOutline")) {
					MTObject.renderer.sharedMaterial.shader = Shader.Find ("TerrainForMobile/4TexturesToonoutline");
					MTObject.renderer.sharedMaterial.SetColor("_Color", Color(1,1,1,1));
					rampTex = Resources.LoadAssetAtPath("Assets/TerrainForMobile/Shaders/ToonBase/toon ramp.png", Texture);
					MTObject.renderer.sharedMaterial.SetTexture("_Ramp", rampTex);
					currentShaderTxt = "Toon Light Outline";
				}*/
				if(GUILayout.Button ("Unlit")) {
					MTObject.renderer.sharedMaterial.shader = Shader.Find ("TerrainForMobile/4TexturesUnlit");
					MTObject.renderer.sharedMaterial.SetColor("_Color", Color(0.5,0.5,0.5,1));
					currentShaderTxt = "Unlit";
				}
				GUILayout.EndHorizontal();
				Layer1 =MTObject.renderer.sharedMaterial.GetTexture("_Layer1");
				Layer2 =MTObject.renderer.sharedMaterial.GetTexture("_Layer2");
				Layer3 =MTObject.renderer.sharedMaterial.GetTexture("_Layer3");
				Layer4 =MTObject.renderer.sharedMaterial.GetTexture("_Layer4");
				
			}else if (numberOfTextures == 3){
				GUILayout.BeginHorizontal();
				if(GUILayout.Button ("Fastest")) {
					MTObject.renderer.sharedMaterial.shader=  Shader.Find ("TerrainForMobile/3TexturesDiffuseFastest");
					MTObject.renderer.sharedMaterial.SetColor("_Color", Color(1,1,1,1));
					currentShaderTxt = "Fastest";
				}
				if(GUILayout.Button ("Fast")) {
					MTObject.renderer.sharedMaterial.shader = Shader.Find ("TerrainForMobile/3TexturesDiffuseFast");
					MTObject.renderer.sharedMaterial.SetColor("_Color", Color(1,1,1,1));
					currentShaderTxt = "Fast";
				}
				if(GUILayout.Button ("Simple")) {
					MTObject.renderer.sharedMaterial.shader = Shader.Find ("TerrainForMobile/3TexturesDiffuseSimple");
					MTObject.renderer.sharedMaterial.SetColor("_Color", Color(1,1,1,1));
					currentShaderTxt = "Simple";
				}
				GUILayout.EndHorizontal();
				GUILayout.BeginHorizontal();
				
				
				if(GUILayout.Button ("Bump Fastest")) {
					MTObject.renderer.sharedMaterial.shader=  Shader.Find ("TerrainForMobile/3TexturesBumpDiffuseFastest");
					MTObject.renderer.sharedMaterial.SetColor("_Color", Color(1,1,1,1));
					currentShaderTxt = "Bump Fastest";
				}
				if(GUILayout.Button ("Bump Fast")) {
					MTObject.renderer.sharedMaterial.shader = Shader.Find ("TerrainForMobile/3TexturesBumpDiffuseFast");
					MTObject.renderer.sharedMaterial.SetColor("_Color", Color(1,1,1,1));
					currentShaderTxt = "Bump Fast";
				}
				if(GUILayout.Button ("Bump Simple")) {
					MTObject.renderer.sharedMaterial.shader = Shader.Find ("TerrainForMobile/3TexturesBumpDiffuseSimple");
					MTObject.renderer.sharedMaterial.SetColor("_Color", Color(1,1,1,1));
					currentShaderTxt = "Bump Simple";
				}
				GUILayout.EndHorizontal();
				GUILayout.BeginHorizontal();
				if(GUILayout.Button ("Toon")) {
					MTObject.renderer.sharedMaterial.shader=  Shader.Find ("TerrainForMobile/3TexturesToon");
					MTObject.renderer.sharedMaterial.SetColor("_Color", Color(1,1,1,1));
					rampTex = Resources.LoadAssetAtPath("Assets/TerrainForMobile/Shaders/ToonBase/toon ramp.png", Texture);
					MTObject.renderer.sharedMaterial.SetTexture("_Ramp", rampTex);
					currentShaderTxt = "Toon Light";
				}
		/*		if(GUILayout.Button ("ToonOutline")) {
					MTObject.renderer.sharedMaterial.shader = Shader.Find ("TerrainForMobile/3TexturesToonoutline");
					MTObject.renderer.sharedMaterial.SetColor("_Color", Color(1,1,1,1));
					rampTex = Resources.LoadAssetAtPath("Assets/TerrainForMobile/Shaders/ToonBase/toon ramp.png", Texture);
					MTObject.renderer.sharedMaterial.SetTexture("_Ramp", rampTex);
					currentShaderTxt = "Toon Light Outline";
				}*/
				if(GUILayout.Button ("Unlit")) {
					MTObject.renderer.sharedMaterial.shader = Shader.Find ("TerrainForMobile/3TexturesUnlit");
					MTObject.renderer.sharedMaterial.SetColor("_Color", Color(0.5,0.5,0.5,1));
					currentShaderTxt = "Unlit";
				}
				GUILayout.EndHorizontal();
				
				Layer1 =MTObject.renderer.sharedMaterial.GetTexture("_Layer1");
				Layer2 =MTObject.renderer.sharedMaterial.GetTexture("_Layer2");
				Layer3 =MTObject.renderer.sharedMaterial.GetTexture("_Layer3");
			
			}else if (numberOfTextures == 2 && !( MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesVLMBXSGXGLES1.1")|| MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesMBXSGXUnLitGLES1.1")|| MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesLMSGXGLES1.1"))){
				GUILayout.BeginHorizontal();
				if(GUILayout.Button ("Fastest")) {
					MTObject.renderer.sharedMaterial.shader=  Shader.Find ("TerrainForMobile/2TexturesDiffuseFastest");
					MTObject.renderer.sharedMaterial.SetColor("_Color", Color(1,1,1,1));
					currentShaderTxt = "Fastest";
				}
				if(GUILayout.Button ("Fast")) {
					MTObject.renderer.sharedMaterial.shader = Shader.Find ("TerrainForMobile/2TexturesDiffuseFast");
					MTObject.renderer.sharedMaterial.SetColor("_Color", Color(1,1,1,1));
					currentShaderTxt = "Fast";
				}
				if(GUILayout.Button ("Simple")) {
					MTObject.renderer.sharedMaterial.shader = Shader.Find ("TerrainForMobile/2TexturesDiffuseSimple");
					MTObject.renderer.sharedMaterial.SetColor("_Color", Color(1,1,1,1));
					currentShaderTxt = "Simple";
				}
				GUILayout.EndHorizontal();
				GUILayout.BeginHorizontal();
				if(GUILayout.Button ("Toon")) {
					MTObject.renderer.sharedMaterial.shader=  Shader.Find ("TerrainForMobile/2TexturesToon");
					MTObject.renderer.sharedMaterial.SetColor("_Color", Color(1,1,1,1));
					rampTex = Resources.LoadAssetAtPath("Assets/TerrainForMobile/Shaders/ToonBase/toon ramp.png", Texture);
					MTObject.renderer.sharedMaterial.SetTexture("_Ramp", rampTex);
					currentShaderTxt = "Toon Light";
				}
			/*	if(GUILayout.Button ("ToonOutline")) {
					MTObject.renderer.sharedMaterial.shader = Shader.Find ("TerrainForMobile/2TexturesToonoutline");
					MTObject.renderer.sharedMaterial.SetColor("_Color", Color(1,1,1,1));
					rampTex = Resources.LoadAssetAtPath("Assets/TerrainForMobile/Shaders/ToonBase/toon ramp.png", Texture);
					MTObject.renderer.sharedMaterial.SetTexture("_Ramp", rampTex);
					currentShaderTxt = "Toon Light Outline";
				}*/
				if(GUILayout.Button ("Unlit")) {
					MTObject.renderer.sharedMaterial.shader = Shader.Find ("TerrainForMobile/2TexturesUnlit");
					MTObject.renderer.sharedMaterial.SetColor("_Color", Color(0.5,0.5,0.5,1));
					currentShaderTxt = "Unlit";
				}
				GUILayout.EndHorizontal();
				Layer1 =MTObject.renderer.sharedMaterial.GetTexture("_Layer1");
				Layer2 =MTObject.renderer.sharedMaterial.GetTexture("_Layer2");
			}else if(MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesVLMBXSGXGLES1.1")|| MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesMBXSGXUnLitGLES1.1")|| MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/2TexturesLMSGXGLES1.1")){
				if(GUILayout.Button ("2 Textures VertexLit (No Lightmap)")) {
					MTObject.renderer.sharedMaterial.shader=  Shader.Find ("TerrainForMobile/2TexturesVLMBXSGXGLES1.1");
					MTObject.renderer.sharedMaterial.SetColor("_Color", Color(1,1,1,1));
					currentShaderTxt = "";
				}
				if(GUILayout.Button ("2 Textures UnLit (No Lightmap)")) {
					MTObject.renderer.sharedMaterial.shader = Shader.Find ("TerrainForMobile/2TexturesMBXSGXUnLitGLES1.1");
					MTObject.renderer.sharedMaterial.SetColor("_Color", Color(1,1,1,1));
					currentShaderTxt = "";
				}
				if(GUILayout.Button ("2 Textures VertexLit/Lightmap (Not MBXLite)")) {
					MTObject.renderer.sharedMaterial.shader = Shader.Find ("TerrainForMobile/2TexturesLMSGXGLES1.1");
					MTObject.renderer.sharedMaterial.SetColor("_Color", Color(1,1,1,1));
					currentShaderTxt = "";
				}
				Layer1 =MTObject.renderer.sharedMaterial.GetTexture("_Layer1");
				Layer2 =MTObject.renderer.sharedMaterial.GetTexture("_Layer2");
			}
			GUILayout.EndVertical();	
			
			
			EditorGUILayout.Space();
			
			GUILayout.Label("Textures", EditorStyles.boldLabel);
			GUILayout.BeginVertical("Box");
			GUILayout.BeginHorizontal();
			GUILayout.FlexibleSpace();
			Layer1=EditorGUILayout.ObjectField(Layer1, typeof(Texture),true, GUILayout.Width(70), GUILayout.Height(70)) as Texture;
			Layer2=EditorGUILayout.ObjectField(Layer2, typeof(Texture),true, GUILayout.Width(70), GUILayout.Height(70)) as Texture;
			if (numberOfTextures > 2)
			Layer3=EditorGUILayout.ObjectField(Layer3, typeof(Texture),true, GUILayout.Width(70), GUILayout.Height(70)) as Texture;
			if (numberOfTextures == 4)
			Layer4=EditorGUILayout.ObjectField(Layer4, typeof(Texture),true, GUILayout.Width(70), GUILayout.Height(70)) as Texture;
			GUILayout.FlexibleSpace();
			GUILayout.EndHorizontal();
			MTObject.renderer.sharedMaterial.SetTexture("_Layer1", Layer1);
			MTObject.renderer.sharedMaterial.SetTexture("_Layer2", Layer2);
			if (numberOfTextures > 2)
			MTObject.renderer.sharedMaterial.SetTexture("_Layer3", Layer3);
			if (numberOfTextures == 4)
			MTObject.renderer.sharedMaterial.SetTexture("_Layer4", Layer4);
			
			if (MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/3TexturesBumpDiffuseSimple")|| MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/3TexturesBumpDiffuseFastest") || MTObject.renderer.sharedMaterial.shader == Shader.Find ("TerrainForMobile/3TexturesBumpDiffuseFast")){
				EditorGUILayout.Space();
			
				GUILayout.Label("Bump Textures", EditorStyles.boldLabel);
				Layer1N =MTObject.renderer.sharedMaterial.GetTexture("_BumpLayer1");
				Layer2N =MTObject.renderer.sharedMaterial.GetTexture("_BumpLayer2");
				Layer3N =MTObject.renderer.sharedMaterial.GetTexture("_BumpLayer3");
				GUILayout.BeginHorizontal();
				GUILayout.FlexibleSpace();
				Layer1N=EditorGUILayout.ObjectField(Layer1N, typeof(Texture),true, GUILayout.Width(70), GUILayout.Height(70)) as Texture;
				Layer2N=EditorGUILayout.ObjectField(Layer2N, typeof(Texture),true, GUILayout.Width(70), GUILayout.Height(70)) as Texture;
				Layer3N=EditorGUILayout.ObjectField(Layer3N, typeof(Texture),true, GUILayout.Width(70), GUILayout.Height(70)) as Texture;
				GUILayout.FlexibleSpace();
				GUILayout.EndHorizontal();
				MTObject.renderer.sharedMaterial.SetTexture("_BumpLayer1", Layer1N);
				MTObject.renderer.sharedMaterial.SetTexture("_BumpLayer2", Layer2N);
				MTObject.renderer.sharedMaterial.SetTexture("_BumpLayer3", Layer3N);
			}
			GUILayout.EndVertical();
			EditorGUILayout.Space();
			
			GUILayout.Label("Finalize T4M(will no longer be an T4M object)", EditorStyles.boldLabel);
			GUILayout.BeginVertical("Box");
			 
			 if(GUILayout.Button ("Compress Mask Texture to RGBA PVRTC 2 bits")) {
				if (EditorUtility.DisplayDialog  ("Confirm Finalization" , "will no longer be an T4M object", "Process", "Abord")){
			 	var MaskComp2 : TextureImporter;
				MaskComp2= AssetImporter.GetAtPath ("Assets/"+MTObject.name+".png") as TextureImporter;
				MaskComp2.textureFormat = TextureImporterFormat.PVRTC_RGBA2;
				MaskComp2.isReadable = true;
				AssetDatabase.ImportAsset ("Assets/"+MTObject.name+".png", ImportAssetOptions.ForceUpdate);
				var T4MOScript2 =  MTObject.gameObject.GetComponent ("T4MObject");
				DestroyImmediate (T4MOScript2);
				};
			}
			if(GUILayout.Button ("Compress Mask Texture to RGBA PVRTC 4 bits")) {
				if (EditorUtility.DisplayDialog  ("Confirm Finalization" , "will no longer be an T4M object", "Process", "Abord")){
				var MaskComp4 : TextureImporter;
				MaskComp4= AssetImporter.GetAtPath ("Assets/"+MTObject.name+".png") as TextureImporter;
				MaskComp4.textureFormat = TextureImporterFormat.PVRTC_RGBA4;
				MaskComp4.isReadable = true;
				AssetDatabase.ImportAsset ("Assets/"+MTObject.name+".png", ImportAssetOptions.ForceUpdate);
				var T4MOScript =  MTObject.gameObject.GetComponent ("T4MObject");
				DestroyImmediate (T4MOScript);
				}
			}
			if(GUILayout.Button ("Just Finalise (keep ARGB Texture)")) {
				if (EditorUtility.DisplayDialog  ("Confirm Finalization" , "will no longer be an T4M object", "Process", "Abord")){
				var T4MOScript1 =  MTObject.gameObject.GetComponent ("T4MObject");
				DestroyImmediate (T4MOScript1);
				}
			}
			GUILayout.EndVertical();
	}
	///Moke T4M Object
	function ObjectToT4M(){
		
			GUILayout.Label("Object must have a Planar Mapping UV (Y axis)");
			EditorGUILayout.Space();
			GUILayout.Label("OpenGLES Version : ", EditorStyles.boldLabel);
			GLESShader = EditorGUILayout.EnumPopup ("OpenGLES",GLESShader, GUILayout.Width(225));
			EditorGUILayout.Space();
			GUILayout.Label("Mobile Terrain Name", EditorStyles.boldLabel);
			 ObjectToconvert.name = GUILayout.TextField (ObjectToconvert.name, 25);
			 EditorGUILayout.Space();
			EditorGUILayout.Space();
		GUILayout.Label("Mobile Terrain Mask Resolution", EditorStyles.boldLabel);
			TextureReso = GUILayout.Toolbar(TextureReso, MenuReso);
			switch (TextureReso)
			{
            case 0:
                 finalReso=256;
                break;
            case 1:
               finalReso=512;
				 break;
			}
				EditorGUILayout.Space();
				EditorGUILayout.Space();
				if (GLESShader== EnumGLES.OpenGLES2){
				GUILayout.Label("Mobile Terrain Shader", EditorStyles.boldLabel);
				NoTx = GUILayout.Toolbar(NoTx, MenuTexture);
				switch (NoTx)
				{
				case 0:
					TxType=4;
                break;
				case 1:
					TxType=3;
				 break;
				 case 2:
					TxType=2;
				 break;
				}
				}
				EditorGUILayout.Space();
				EditorGUILayout.Space();
				EditorGUILayout.Space();
				if (GUILayout.Button("Process", GUILayout.Width(100))) {
					ApplyTo();
				}
	
	}
	
	///
	function ConvertMenu (){
		if (!terrainDat && TerrainToconvert)
			HMGet();
			
		GUILayout.BeginVertical("Box");
		if (!vertexInfo && TerrainToconvert){
			GUILayout.Label("OpenGLES Version : ", EditorStyles.boldLabel);
			GLESShader = EditorGUILayout.EnumPopup ("OpenGLES",GLESShader, GUILayout.Width(225));
			EditorGUILayout.Space();
			EditorGUILayout.Space();
			GUILayout.Label("Mobile Terrain Name", EditorStyles.boldLabel);
			terrainName = GUILayout.TextField (terrainName, 25);
			EditorGUILayout.Space();
			EditorGUILayout.Space();
			GUILayout.Label("Mobile Terrain Quality", EditorStyles.boldLabel);
			GUILayout.BeginHorizontal();
			GUILayout.Label(" <" );
				GUILayout.FlexibleSpace();
			resolutionV = EditorGUILayout.IntField(resolutionV, GUILayout.Width(30));
			GUILayout.Label("x "+resolutionV+ " : "+(X*Y).ToString()+ " Verts");
			
			GUILayout.FlexibleSpace();
			GUILayout.Label(" >" );
			GUILayout.EndHorizontal();
			resolutionV= GUILayout.HorizontalScrollbar (resolutionV,0.0,32,180);
			EditorGUILayout.Space();
			EditorGUILayout.Space();
			tRes = (HeightmapWidth)/resolutionV;
			X = (HeightmapWidth-1) / tRes + 1;
			Y = (HeightmapHeight-1) / tRes + 1;
			/*if (GUILayout.Button("Test")) {
				HMGet();
			}*/
			
			GUILayout.Label("Mobile Terrain Mask Resolution", EditorStyles.boldLabel);
			TextureReso = GUILayout.Toolbar(TextureReso, MenuReso);
			switch (TextureReso)
			{
            case 0:
                 finalReso=512;
                break;
            case 1:
                finalReso=1024;
				 break;
			case 2:
               finalReso=2048;
				 break;
			
			}
				EditorGUILayout.Space();
				EditorGUILayout.Space();
			if (GLESShader==  EnumGLES.OpenGLES2){
				GUILayout.Label("Mobile Terrain Shader", EditorStyles.boldLabel);
				NoTx = GUILayout.Toolbar(NoTx, MenuTexture);
				switch (NoTx)
				{
				case 0:
					TxType=4;
                break;
				case 1:
					TxType=3;
				 break;
				 case 2:
					TxType=2;
				 break;
				}
				}
				EditorGUILayout.Space();
				EditorGUILayout.Space();
				EditorGUILayout.Space();
				GUILayout.BeginHorizontal();
				GUILayout.FlexibleSpace();
				if (GUILayout.Button("Process", GUILayout.Width(100))) {
					Convert();
				}
				GUILayout.EndHorizontal();
				
         
			} else if (vertexInfo && TerrainToconvert){
			if (keep == 0){
				keep = 1;
				oldTerraintoConv = TerrainToconvert;
			}
			GUILayout.Label("Mobile Terrain Final Resolution : " , EditorStyles.boldLabel);
			GUILayout.Label("Vertex : "+vertexInfo.vertexCount);
			GUILayout.Label("Triangle : "+vertexInfo.triangles.Length / 3);
			EditorGUILayout.Space();
			EditorGUILayout.Space();
			GUILayout.BeginVertical("Box");
			GUILayout.Label("If your conversion seems no smoothed : ", EditorStyles.boldLabel);
			EditorGUILayout.Space();
			GUILayout.Label("Click On :");
			GUILayout.Label("\"Modify Options and Start New Conversion.\"");
			GUILayout.Label("and Restart the Conversion");
			GUILayout.EndVertical();
			EditorGUILayout.Space();
			EditorGUILayout.Space();
			if (GUILayout.Button("Keep my Conversion and Destroy Original")) {
					DestroyImmediate(oldTerraintoConv.gameObject);
					keep = 0;
					TerrainToconvert= null;
					vertexInfo = null;
			}
			if (GUILayout.Button("Modify Options and Start a New Conversion")) {
				DestroyImmediate(Child);
				AssetDatabase.DeleteAsset ("Assets/"+terrainName+".obj");
				AssetDatabase.DeleteAsset ("Assets/"+terrainName+".png");
				AssetDatabase.DeleteAsset ("Assets/"+terrainName+".mat");
				TerrainToconvert.enabled = true;
				vertexInfo=null;
				keep = 0;
			}
			
			}else GUILayout.Label("Select a Unity Terrain First");
		GUILayout.EndVertical();
	}
	
	function HMGet(){
		terrainDat = TerrainToconvert.terrainData;
		HeightmapWidth = terrainDat.heightmapWidth;
		HeightmapHeight = terrainDat.heightmapHeight;
	}
	function Convert () {
		terrain = TerrainToconvert.terrainData;
        var w = terrain.heightmapWidth;
        var h = terrain.heightmapHeight;
        var meshScale = terrain.size;
        meshScale = Vector3(meshScale.x/(w-1)*tRes, meshScale.y, meshScale.z/(h-1)*tRes);
	    var uvScale = Vector2(1.0/(w-1), 1.0/(h-1));
        var tData = terrain.GetHeights(0, 0, w, h);
        w = (w-1) / tRes + 1;
        h = (h-1) / tRes + 1;
        var tVertices = new Vector3[w * h];
        var tUV = new Vector2[w * h];
        var tPolys = new int[(w-1) * (h-1) * 6];
        for (y = 0; y < h; y++) {
			for (x = 0; x < w; x++) {
                tVertices[y*w + x] = Vector3.Scale(meshScale, Vector3(x, tData[x*tRes,y*tRes], y));
                tUV[y*w + x] = Vector2.Scale(Vector2(x*tRes, y*tRes), uvScale);
            }
        }
        var index = 0;
            for (y = 0; y < h-1; y++) {
                for (x = 0; x < w-1; x++) {
                    tPolys[index++] = (y*w) + x;
                    tPolys[index++] = ((y+1) * w) + x;
                    tPolys[index++] = (y*w) + x + 1;
        
                    tPolys[index++] = ((y+1) * w) + x;
                    tPolys[index++] = ((y+1) * w) + x + 1;
                    tPolys[index++] = (y*w) + x + 1;
                }
            }
        try {
            var sw = new StreamWriter("Assets/"+terrainName+".obj");
            sw.WriteLine("# Terrain4Mobile File");
            System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo("en-US");
            counter = tCount = 0;
            totalCount = (tVertices.Length*2 + (tPolys.Length/3)) / progressUpdateInterval;
            for (i = 0; i < tVertices.Length; i++) {
                UpdateProgress();
                var sb = StringBuilder("v ", 20);
                sb.Append(tVertices[i].x.ToString()).Append(" ").
                   Append(tVertices[i].y.ToString()).Append(" ").
                   Append(tVertices[i].z.ToString());
                sw.WriteLine(sb);
            }
            for (i = 0; i < tUV.Length; i++) {
                UpdateProgress();
                sb = StringBuilder("vt ", 22);
                sb.Append(tUV[i].x.ToString()).Append(" ").
                   Append(tUV[i].y.ToString());
                sw.WriteLine(sb);
            }
                for (i = 0; i < tPolys.Length; i += 3) {
                    UpdateProgress();
                    sb = StringBuilder("f ", 43);
                    sb.Append(tPolys[i]+1).Append("/").Append(tPolys[i]+1).Append(" ").
                       Append(tPolys[i+1]+1).Append("/").Append(tPolys[i+1]+1).Append(" ").
                       Append(tPolys[i+2]+1).Append("/").Append(tPolys[i+2]+1);
                    sw.WriteLine(sb);
                }
        }
        catch (err) {
            Debug.Log("Error saving file: " + err.Message);
        }
        sw.Close();
		
		var NewMaskText = new Texture2D (finalReso, finalReso,  TextureFormat.ARGB32, true);
		var ColorBase : Color[] = new Color[finalReso * finalReso];
		if(GLESShader !=  EnumGLES.OpenGLES11){
			for (var t = 0; t < ColorBase.Length; t++) {
				ColorBase[t] = new Color (1, 0, 0, 0);
			}
		}else{
			for (var tt = 0; tt < ColorBase.Length; tt++) {
				ColorBase[tt] = new Color (1, 1, 1, 0);
			}
		}
		NewMaskText.SetPixels (ColorBase);
		var path = "Assets/"+ terrainName +".png";
		var data = NewMaskText.EncodeToPNG ();
		File.WriteAllBytes (path, data);
	    
		AssetDatabase.ImportAsset ("Assets/"+terrainName+".obj", ImportAssetOptions.ForceUpdate);
		AssetDatabase.ImportAsset (path, ImportAssetOptions.ForceUpdate);
		UpdateProgress();
		var TextureI= AssetImporter.GetAtPath (path) as TextureImporter;
		TextureI.textureFormat = TextureImporterFormat.ARGB32;
		TextureI.isReadable = true;
		TextureI.anisoLevel = 9;
		TextureI.mipmapEnabled = false;
		TextureI.wrapMode = TextureWrapMode.Clamp;
		AssetDatabase.ImportAsset (path, ImportAssetOptions.ForceUpdate);
		
		var OBJI= ModelImporter.GetAtPath ("Assets/"+terrainName+".obj") as ModelImporter;
		OBJI.normalSmoothingAngle = 180;
		OBJI.generateMaterials = ModelImporterGenerateMaterials.None;
		OBJI.normalImportMode =ModelImporterTangentSpaceMode.Calculate;
		OBJI.generateAnimations = ModelImporterGenerateAnimations.None;
		AssetDatabase.ImportAsset ("Assets/"+terrainName+".obj", ImportAssetOptions.ForceUpdate);
		
		var prefab = Resources.LoadAssetAtPath("Assets/"+terrainName+".obj", GameObject);
		
		var forRotate = Instantiate (prefab, TerrainToconvert.transform.position, Quaternion.identity);	
		Child= forRotate.Find("default");
		forRotate.transform.DetachChildren();
		DestroyImmediate(forRotate);
		Child.name = terrainName;
		Child.AddComponent("T4MObject");
		Child.AddComponent("MeshCollider");
		Child.isStatic = true;
		Child.transform.rotation= Quaternion.Euler(0, 90, 0);
		vertexInfo = Child.GetComponent(MeshFilter).sharedMesh;
		
		TerrainToconvert.enabled = false;
		UpdateProgress();
		var Tmaterial : Material;
		if(TxType==4 && GLESShader !=  EnumGLES.OpenGLES11)
			Tmaterial = new Material (Shader.Find("TerrainForMobile/4TexturesDiffuseFast"));
		else if (TxType == 3 && GLESShader !=  EnumGLES.OpenGLES11)
			Tmaterial = new Material (Shader.Find("TerrainForMobile/3TexturesDiffuseFast"));
		else if (TxType == 2 && GLESShader !=  EnumGLES.OpenGLES11)
			Tmaterial = new Material (Shader.Find("TerrainForMobile/2TexturesDiffuseFast"));
		else if (GLESShader==  EnumGLES.OpenGLES11)
			Tmaterial = new Material (Shader.Find("TerrainForMobile/2TexturesVLMBXSGXGLES1.1"));
			
		AssetDatabase.CreateAsset(Tmaterial, "Assets/"+terrainName+".mat");
		AssetDatabase.ImportAsset ("Assets/"+terrainName+".mat", ImportAssetOptions.ForceUpdate);
		Child.renderer.material = Tmaterial;
		var test = Resources.LoadAssetAtPath(path, Texture);
		
		Child.renderer.sharedMaterial.SetTexture ("_MainTex", test);
		
		//Child.renderer.sharedMaterial.hideFlags = HideFlags.HideInInspector;
		EditorUtility.SetSelectedWireframeHidden(Child.renderer, true);
		Child.layer = 31;
		EditorUtility.ClearProgressBar();
}

function ApplyTo(){
		var NewMaskText2 = new Texture2D (finalReso, finalReso,  TextureFormat.ARGB32, true);
		var ColorBase2 : Color[] = new Color[finalReso * finalReso];
		if(GLESShader !=  EnumGLES.OpenGLES11){
			for (var t = 0; t < ColorBase2.Length; t++) {
				ColorBase2[t] = new Color (1, 0, 0, 0);
			}
		}else{
			for (var tt = 0; tt < ColorBase2.Length; tt++) {
				ColorBase2[tt] = new Color (1, 1, 1, 0);
			}
		}
		NewMaskText2.SetPixels (ColorBase2);
		var path2 = "Assets/"+ ObjectToconvert.name +".png";
		var data2 = NewMaskText2.EncodeToPNG ();
		File.WriteAllBytes (path2, data2);
	   
		AssetDatabase.ImportAsset (path2, ImportAssetOptions.ForceUpdate);
		var TextureIm= AssetImporter.GetAtPath (path2) as TextureImporter;
		TextureIm.textureFormat = TextureImporterFormat.ARGB32;
		TextureIm.isReadable = true;
		TextureIm.anisoLevel = 9;
		TextureIm.mipmapEnabled = false;
		TextureIm.wrapMode = TextureWrapMode.Clamp;
		AssetDatabase.ImportAsset (path2, ImportAssetOptions.ForceUpdate);
		if (ObjectToconvert.collider){
			DestroyImmediate(ObjectToconvert.collider);
		}
		ObjectToconvert.AddComponent("MeshCollider");
		ObjectToconvert.AddComponent("T4MObject");
		ObjectToconvert.isStatic = true;
		var Tmaterial2 : Material ;
		if(TxType==4 && GLESShader!=  EnumGLES.OpenGLES11)
			Tmaterial2 = new Material (Shader.Find("TerrainForMobile/4TexturesDiffuseFast"));
		else if (TxType == 3 && GLESShader!=  EnumGLES.OpenGLES11)
			Tmaterial2 = new Material (Shader.Find("TerrainForMobile/3TexturesDiffuseFast"));
		else if (TxType == 2 && GLESShader!=  EnumGLES.OpenGLES11)
			Tmaterial2 = new Material (Shader.Find("TerrainForMobile/2TexturesDiffuseFast"));
		else if (GLESShader==  EnumGLES.OpenGLES11)
			Tmaterial2 = new Material (Shader.Find("TerrainForMobile/2TexturesVLMBXSGXGLES1.1"));
			
		AssetDatabase.CreateAsset(Tmaterial2, "Assets/"+ObjectToconvert.name+".mat");
		AssetDatabase.ImportAsset ("Assets/"+ObjectToconvert.name+".mat", ImportAssetOptions.ForceUpdate);
		ObjectToconvert.renderer.material = Tmaterial2;
		var test2 = Resources.LoadAssetAtPath(path2, Texture);
		ObjectToconvert.layer = 31;
		ObjectToconvert.renderer.sharedMaterial.SetTexture ("_MainTex", test2);
		oldSelect = null;
		//ObjectToconvert.renderer.sharedMaterial.hideFlags = HideFlags.HideInInspector;
		EditorUtility.SetSelectedWireframeHidden(ObjectToconvert.renderer, true);
}
	function ChangeOpenGles(){
	GUILayout.BeginVertical("Box");
				GUILayout.Label("You must Repaint after that. ");
			GUILayout.Label("Mobile Terrain Mask Resolution", EditorStyles.boldLabel);
			TextureReso = GUILayout.Toolbar(TextureReso, MenuReso);
			switch (TextureReso)
			{
            case 0:
                 finalReso=256;
                break;
            case 1:
               finalReso=512;
				 break;
			}
			EditorGUILayout.Space();
			EditorGUILayout.Space();
				if (GUILayout.Button("PROCESS", GUILayout.Width(100))) {
						ChangeOpenGlesProc();
				}
			GUILayout.EndVertical();
	}
	function ChangeOpenGlesProc(){
		var NewMaskText2 = new Texture2D (finalReso, finalReso,  TextureFormat.ARGB32, true);
		var ColorBase2 : Color[] = new Color[finalReso * finalReso];
			for (var tt = 0; tt < ColorBase2.Length; tt++) {
				ColorBase2[tt] = new Color (1, 1, 1, 0);
			}
		NewMaskText2.SetPixels (ColorBase2);
		var path2 = "Assets/"+ MTObject.name +".png";
		var data2 = NewMaskText2.EncodeToPNG ();
		File.WriteAllBytes (path2, data2);
		AssetDatabase.ImportAsset (path2, ImportAssetOptions.ForceUpdate);
		var TextureIm= AssetImporter.GetAtPath (path2) as TextureImporter;
		TextureIm.textureFormat = TextureImporterFormat.ARGB32;
		TextureIm.isReadable = true;
		TextureIm.anisoLevel = 9;
		TextureIm.mipmapEnabled = false;
		TextureIm.wrapMode = TextureWrapMode.Clamp;
		AssetDatabase.ImportAsset (path2, ImportAssetOptions.ForceUpdate);
		MTObject.renderer.sharedMaterial.shader = Shader.Find ("TerrainForMobile/2TexturesVLMBXSGXGLES1.1");
		var test2 = Resources.LoadAssetAtPath(path2, Texture);
		MTObject.renderer.sharedMaterial.SetTexture ("_MainTex", test2);
		ShaderUpdt ();
		selTexture = 0;
		selBrush =0;
		Pinit = 0;
	}
	
    function UpdateProgress () {
        if (counter++ == progressUpdateInterval) {
            counter = 0;
            EditorUtility.DisplayProgressBar("Generate...", "", Mathf.InverseLerp(0, totalCount, ++tCount));
        }
    }
}