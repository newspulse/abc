precision mediump float;

uniform sampler2D blipImage;

void main() {
	// set pixels in points to something that stands out
	gl_FragColor = texture2D(blipImage, gl_PointCoord);
}