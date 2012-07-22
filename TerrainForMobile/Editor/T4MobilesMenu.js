@CustomEditor(T4MObject)
class T4MobilesMenu extends Editor {
var TreeList : GameObject;
var ToggleF =false;


function OnSceneGUI  () {

	if (T4M.MTObject != null ){
		if (T4M.MenuToolbar ==2 )
			Painting();
		if (T4M.MenuToolbar ==3)
			Planting();
		}
}

function Painting (){
	if (T4M.tex != null){
	
		var e  = Event.current;
			HandleUtility.AddDefaultControl (0);
			var raycastHit = new RaycastHit();
			var terrainRay  = HandleUtility.GUIPointToWorldRay (e.mousePosition);
		
			if(Physics.Raycast(terrainRay, raycastHit, Mathf.Infinity)){
				T4M.Preview.transform.position = raycastHit.point;
				if ((e.type ==  EventType.mouseDrag && e.alt == false && e.button == 0) || ( e.shift == true && e.button == 1)){	
					var pixelUV = raycastHit.textureCoord;
					pixelUV.x *= T4M.tex.width;
					pixelUV.y *= T4M.tex.height;
					
				
					var BrsuhSizeCW = Mathf.Clamp(pixelUV.x-T4M.BrushSizeInPourcent/2,0,T4M.tex.width-T4M.BrushSizeInPourcent);
					var BrsuhSizeCH = Mathf.Clamp(pixelUV.y-T4M.BrushSizeInPourcent/2,0,T4M.tex.height-T4M.BrushSizeInPourcent);
		
					var terrainBay : Color[] = T4M.tex.GetPixels (BrsuhSizeCW, BrsuhSizeCH, T4M.BrushSizeInPourcent,T4M.BrushSizeInPourcent, 0);
			
					for( var i = 0; i < terrainBay.Length ; i++ ) {
						terrainBay[i] = Color.Lerp(terrainBay[i], T4M.targetColor, T4M.BrushAlpha[i]*T4M.Stronger);
					}
					T4M.tex.SetPixels(BrsuhSizeCW, BrsuhSizeCH,T4M.BrushSizeInPourcent,T4M.BrushSizeInPourcent, terrainBay,0);
					T4M.tex.Apply();
					ToggleF = true;
					 Undo.RegisterUndo(T4M.tex, T4M.tex.name);
				}else if (e.type ==  EventType.mouseUp && e.alt == false && e.button == 0 && ToggleF == true){
						ToggleF = false;
						T4M.SaveTexture();
				}
			
		}
	}
} 



function Planting (){
		
		
	if (T4M.PlObjectList != null && T4M.PlObjectList.Count >0 ){
			
		HandleUtility.AddDefaultControl (0);
		var e  = Event.current;
			
		if (e.type ==  EventType.mouseDown && e.alt == false && e.button == 0 && ToggleF == false){
			var raycastHit = new RaycastHit();
			var terrainRay  = HandleUtility.GUIPointToWorldRay (e.mousePosition);
			
			if(Physics.Raycast(terrainRay, raycastHit, Mathf.Infinity)){
					var Variation = Random.Range (T4M.Size+T4M.SizeVar/100, T4M.Size - T4M.SizeVar/100);
						var NewVeg : GameObject;
					
						if (T4M.MenuPaintTP==1){
							NewVeg =  EditorUtility.InstantiatePrefab(T4M.PlObjectList[T4M.selPObj]) as GameObject; 
							NewVeg.transform.position = raycastHit.point + (raycastHit.normal * 0.02f);
							NewVeg.transform.position.y += T4M.YorigineCorrect;
							NewVeg.transform.rotation =Quaternion.FromToRotation(Vector3.up, raycastHit.normal);
						}else {
							NewVeg =  EditorUtility.InstantiatePrefab(T4M.PlObjectList[T4M.selPObj]) as GameObject; 
							NewVeg.transform.position = raycastHit.point + (raycastHit.normal * 0.02f);
							NewVeg.transform.position.y += T4M.YorigineCorrect;
							NewVeg.transform.rotation = Quaternion.identity;

							if (T4M.RandomRot){
								var RandomAngle = Random.Range (0,360);
								NewVeg.transform.eulerAngles = Vector3(0, RandomAngle, 0);
							}
						}
						NewVeg.transform.transform.localScale = new Vector3(Variation,Variation,Variation);
						
						TreeList = GameObject.Find(T4M.GrpName);
						
						
						if (!TreeList){
							TreeList = new GameObject (T4M.GrpName);
						}
						
						NewVeg.transform.parent = TreeList.transform;
						
						if (T4M.ObjectLayer == 0)
							NewVeg.layer = 28;
						else if (T4M.ObjectLayer == 1)
							NewVeg.layer = 29;
						else if (T4M.ObjectLayer == 2)
							NewVeg.layer = 30;
						else if (T4M.ObjectLayer == 3)
							NewVeg.layer = 31;
						
						if (T4M.CreateCollision)
							NewVeg.AddComponent("MeshCollider");
						if (T4M.Static)
								NewVeg.isStatic = true;
				}
				ToggleF = true;
				  Undo.RegisterCreatedObjectUndo  (NewVeg,  NewVeg.name);
		} else if (e.type ==  EventType.mouseUp && e.alt == false && e.button == 0 && ToggleF == true)
			ToggleF = false;
	
	}
	}function OnDrawGizmosSelected () {
       Gizmos.color = Color.yellow;
   Gizmos.DrawWireSphere (Vector3 (0,0,0), 100);
}
}
