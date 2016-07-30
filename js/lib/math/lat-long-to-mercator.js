export default function (latitude, longitude) {
	let mapWidth	= 256;
	let mapHeight	= 256;

	// get x value
	let x = (longitude+180)*(mapWidth/360)

	// convert from degrees to radians
	let latRad = latitude*Math.PI/180;

	// get y value
	let mercN = Math.log(Math.tan((Math.PI/4)+(latRad/2)));
	let y	= (mapHeight/2)-(mapWidth*mercN/(2*Math.PI));
	return [x, y];
}