var WaypointsColor : Color;
var draw = true;

function OnDrawGizmos () {
if (draw){
	var waypoints = gameObject.GetComponentsInChildren( Transform );
	
	for ( var waypoint : Transform in waypoints ) {
		Gizmos.color = WaypointsColor;
		Gizmos.DrawSphere( waypoint.position, 1.0 );
	}
	}
}