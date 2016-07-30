import createContext from "gl-context";
import latLongToMercator from "../math/lat-long-to-mercator";

export function initMap() {
		var mapDiv = document.getElementById('map');
		var map = new google.maps.Map(mapDiv, {
			center: {lat: -27.68, lng: 134.78},
			zoom: 4
		});
	  var canvasLayer;
	  var gl;

	  var pointProgram;
	  var pointArrayBuffer;
	  var POINT_COUNT = 2000;

	  var MIN_X = 115;
	  var MAX_X = 151;
	  var MIN_Y = 88;
	  var MAX_Y = 109;

	  var pixelsToWebGLMatrix = new Float32Array(16);
	  var mapMatrix = new Float32Array(16);

	  var resolutionScale = window.devicePixelRatio || 1;

	  function init() {

		// initialize the canvasLayer
		var canvasLayerOptions = {
		  map: map,
		  resizeHandler: resize,
		  animate: false,
		  updateHandler: update,
		  resolutionScale: resolutionScale
		};
		canvasLayer = new CanvasLayer(canvasLayerOptions);

		// initialize WebGL
		gl = createContext(canvasLayer.canvas, {
				premultipliedAlpha: false
			}, function render () {
				// request animation frame
			});

		createShaderProgram();
		loadData();
	  }

	  function createShaderProgram() {
		// create vertex shader
		var vertexSrc = vertShader;
		var vertexShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertexShader, vertexSrc);
		gl.compileShader(vertexShader);

		// create fragment shader
		var fragmentSrc = fragShader;
		var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragmentShader, fragmentSrc);
		gl.compileShader(fragmentShader);

		// link shaders to create our program
		pointProgram = gl.createProgram();
		gl.attachShader(pointProgram, vertexShader);
		gl.attachShader(pointProgram, fragmentShader);
		gl.linkProgram(pointProgram);

		gl.useProgram(pointProgram);
	  }

	  function loadData() {
		// this data could be loaded from anywhere, but in this case we'll
		// generate some random x,y coords in a world coordinate bounding box
		var rawData = new Float32Array(2 * POINT_COUNT);
		for (var i = 0; i < rawData.length; i += 2) {
		  let point = latLongToMercator(-37.8136, 144.9631);
		  rawData[i] = point[0];
		  rawData[i + 1] = point[1];
		}

		// create webgl buffer, bind it, and load rawData into it
		pointArrayBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, pointArrayBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, rawData, gl.STATIC_DRAW);

		// enable the 'worldCoord' attribute in the shader to receive buffer
		var attributeLoc = gl.getAttribLocation(pointProgram, 'worldCoord');
		gl.enableVertexAttribArray(attributeLoc);

		// tell webgl how buffer is laid out (pairs of x,y coords)
		gl.vertexAttribPointer(attributeLoc, 2, gl.FLOAT, false, 0, 0);
	  }

	  function resize() {
		var width = canvasLayer.canvas.width;
		var height = canvasLayer.canvas.height;

		gl.viewport(0, 0, width, height);

		// Matrix which maps pixel coordinates to WebGL coordinates.
		// If canvasLayer is scaled (with resolutionScale), we need to scale
		// this matrix by the same amount to account for the larger number of
		// pixels.
		pixelsToWebGLMatrix.set([
		  2 * resolutionScale / width, 0, 0, 0,
		  0, -2 * resolutionScale / height, 0, 0,
		  0, 0, 0, 0,
		  -1, 1, 0, 1
		]);
	  }

	  function scaleMatrix(matrix, scaleX, scaleY) {
		// scaling x and y, which is just scaling first two columns of matrix
		matrix[0] *= scaleX;
		matrix[1] *= scaleX;
		matrix[2] *= scaleX;
		matrix[3] *= scaleX;

		matrix[4] *= scaleY;
		matrix[5] *= scaleY;
		matrix[6] *= scaleY;
		matrix[7] *= scaleY;
	  }

	  function translateMatrix(matrix, tx, ty) {
		// translation is in last column of matrix
		matrix[12] += matrix[0]*tx + matrix[4]*ty;
		matrix[13] += matrix[1]*tx + matrix[5]*ty;
		matrix[14] += matrix[2]*tx + matrix[6]*ty;
		matrix[15] += matrix[3]*tx + matrix[7]*ty;
	  }

	  function update() {
		gl.clear(gl.COLOR_BUFFER_BIT);
		var mapProjection = map.getProjection();
		console.log("update");
		/**
		 * We need to create a transformation that takes world coordinate
		 * points in the pointArrayBuffer to the coodinates WebGL expects.
		 * 1. Start with second half in pixelsToWebGLMatrix, which takes pixel
		 *     coordinates to WebGL coordinates.
		 * 2. Scale and translate to take world coordinates to pixel coords
		 * see https://developers.google.com/maps/documentation/javascript/maptypes#MapCoordinate
		 */
		
		// copy pixel->webgl matrix
		mapMatrix.set(pixelsToWebGLMatrix);

		// Scale to current zoom (worldCoords * 2^zoom)
		var scale = Math.pow(2, map.zoom);
		scaleMatrix(mapMatrix, scale, scale);

		// translate to current view (vector from topLeft to 0,0)
		var offset = mapProjection.fromLatLngToPoint(canvasLayer.getTopLeft());
		translateMatrix(mapMatrix, -offset.x, -offset.y);

		// attach matrix value to 'mapMatrix' uniform in shader
		var matrixLoc = gl.getUniformLocation(pointProgram, 'mapMatrix');
		gl.uniformMatrix4fv(matrixLoc, false, mapMatrix);

		// draw!
		gl.drawArrays(gl.POINTS, 0, POINT_COUNT);
	  }



var vertShader = `
	  attribute vec4 worldCoord;

	  uniform mat4 mapMatrix;

	  void main() {
		// transform world coordinate by matrix uniform variable
		gl_Position = mapMatrix * worldCoord;

		// a constant size for points, regardless of zoom level
		gl_PointSize = 10.;
	  }
`;

var fragShader = `	  
  precision mediump float;

  void main() {
	// set pixels in points to something that stands out
	gl_FragColor = vec4(.9, .3, .1, 1.);
  }`;

init();

// end
}
