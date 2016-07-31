attribute vec4 worldCoord;
attribute float size;

uniform mat4 mapMatrix;
uniform float psize;

void main() {
	// transform world coordinate by matrix uniform variable
	gl_Position = mapMatrix * worldCoord;

	// a constant size for points, regardless of zoom level
	gl_PointSize = psize * size;
}