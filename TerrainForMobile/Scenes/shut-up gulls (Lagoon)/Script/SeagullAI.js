private var waypoints : Transform[];
private var currentWaypoint : int = 0;
var rotateSpeed = 5.0;
var moveSpeed = 1.0;
var magnitudeMax = 10.0;
var dead = false;
var anim : GameObject;
var sounds : AudioClip[] = new AudioClip[0];
var soundFrequency = 1.00;


function Start () {
	var fz = Core.waypointList.length;
	waypoints = Core.waypointList[Random.Range(0, fz)];
	moveSpeed = Random.Range(10, 20);
	Core.BirdOnScene +=1;
}

function LateUpdate(){

if (!dead){
	var RelativeWaypointPosition : Vector3 = transform.InverseTransformPoint( Vector3(waypoints[currentWaypoint].position.x, waypoints[currentWaypoint].position.y,waypoints[currentWaypoint].position.z ) );
	var targetPoint = Vector3(waypoints[currentWaypoint].position.x,waypoints[currentWaypoint].position.y,waypoints[currentWaypoint].position.z );
	var targetrot = Quaternion.LookRotation ( targetPoint - transform.position);
	transform.rotation = Quaternion.Slerp(transform.rotation, targetrot, Time.deltaTime * rotateSpeed);
	var forward = transform.TransformDirection(Vector3.forward);
	transform.position += forward * moveSpeed*Time.deltaTime;
	if ( RelativeWaypointPosition.magnitude < 10 ) {
		currentWaypoint ++;
		
			if ( currentWaypoint >= waypoints.length ) {
				currentWaypoint = 0;
			}
		}
	}
	if(Core.heat < Mathf.Pow(Random.value, 1 / soundFrequency / Time.deltaTime))
	{
	AudioSource.PlayClipAtPoint(sounds[Random.Range(0, sounds.length)], transform.position, 0.90);	
	Core.heat += (1 / soundFrequency) / 10;
	}
}

function ApplyDamage(){
	dead = true;
	rigidbody.useGravity = true;
	rigidbody.velocity.y = -10;
	anim.animation.Stop();
	Destroy (gameObject, 2);
	Core.BirdOnScene -=1;
}

