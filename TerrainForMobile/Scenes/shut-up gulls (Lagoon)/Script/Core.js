var waypointGroup : GameObject[];
var  waypoints : Array;
static var waypointList = new Array();
static var BirdOnScene : int = 0;
var Spawn1 : Transform;
var Spawn2 : Transform;
var Spawn3 : Transform;
var Spawn4 : Transform;
var TimeSpawn = 0.0;
var Gull : GameObject;
var MaxBird = 8;
static var heat = 0.00;

function Awake () {
GetWaypoints();
	
}

function GetWaypoints () {

	for (var i=0;i<waypointGroup.Length;i++){
	var potentialWaypoints : Array = waypointGroup[i].GetComponentsInChildren( Transform );
	waypoints = new Array();
	
	for ( var potentialWaypoint : Transform in potentialWaypoints ) {
		if ( potentialWaypoint != waypointGroup[i].transform ) {
			waypoints[ waypoints.length ] = potentialWaypoint;
		}
	}
		waypointList.Add(waypoints); 
	}
}

function LateUpdate(){
	if(heat > 0) heat -= Time.deltaTime;
		
	if (BirdOnScene < MaxBird)
		TimeSpawn += Time.deltaTime;
	if (BirdOnScene<MaxBird && TimeSpawn >=5){
		var SpwRand = Mathf.Round (Random.Range(1, 4));
		if (SpwRand == 1)
			Instantiate(Gull, Spawn1.transform.position, Quaternion.identity);
		if (SpwRand == 2)
			Instantiate(Gull, Spawn2.transform.position, Quaternion.identity);
		if (SpwRand == 3)
			Instantiate(Gull, Spawn3.transform.position, Quaternion.identity);
		if (SpwRand == 4)
			Instantiate(Gull, Spawn4.transform.position, Quaternion.identity);
		
		TimeSpawn = 0;
	}
}
