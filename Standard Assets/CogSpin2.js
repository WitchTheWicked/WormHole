
var speed : float = 5;
function Update () {
	transform.Rotate(Vector3.down * speed * Time.deltaTime, Space.World);

}
