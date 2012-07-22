var BackgroundMaxDistance : float= 1000;
var FarMaxDistance : float = 500.0;
var MiddleMaxDistance : float= 300.0;
var CloseMaxDistance : float= 100.0;
private var distances = new float[32];

function Start () {
	
	distances[28] = CloseMaxDistance;
	distances[29] = MiddleMaxDistance;
	distances[30] = FarMaxDistance;
	distances[31] = BackgroundMaxDistance;
    camera.layerCullDistances = distances;
	
}