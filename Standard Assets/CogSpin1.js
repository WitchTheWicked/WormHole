
var speed : float = 5;
function Update () {
	transform.Rotate(Vector3.up * speed * Time.deltaTime, Space.World);

}
