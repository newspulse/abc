import createContext from "gl-context";
import createTex from "gl-texture2d";
import latLongToMercator from "../math/lat-long-to-mercator";
import createShader from "gl-shader";
import theme from "./map-theme";
import controller from "../../controller";


var fs = require("fs");

const vertShader = fs.readFileSync("lib/gl/shaders/points.vert", "utf8");
const fragShader = fs.readFileSync("lib/gl/shaders/points.frag", "utf8");

const munged = JSON.parse(fs.readFileSync("data/munged.json", "utf8"));

let shader, textures = [], glReady = false, sizes;

export function initMap() {
	const mapDiv = document.getElementById('map');
	const map = new google.maps.Map(mapDiv, {
		center: {lat: -27.68, lng: 134.78},
		zoom: 3,
		minZoom: 3,
		mapTypeControl: false,
		streetViewControl: false
	});

	const ausBounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(-9.27562218, 113.37890625),
		new google.maps.LatLng(-44.96479793, 156.88476563)
	);

	map.fitBounds(ausBounds);

	// map.addListener("dragend", () => {
	// 	const center = map.getCenter();

	// 	if (
	// 		center.lat() > ausBounds.f.f ||
	// 		center.lat() < ausBounds.f.b ||
	// 		center.lng() < ausBounds.b.b ||
	// 		center.lng() > ausBounds.b.f
	// 	) {
	// 		map.panToBounds(ausBounds);
	// 	}
	// });

	// Create a new StyledMapType object, passing it the array of styles,
	// as well as the name to be displayed on the map type control.
	var styledMap = new google.maps.StyledMapType(theme,
		{name: "Styled Map"});

	//Associate the styled map with the MapTypeId and set it to display.
	map.mapTypes.set('map_style', styledMap);
	map.setMapTypeId('map_style');

	let canvasLayer;
	let gl;

	let pointProgram;
	let pointArrayBuffer;
	let sizeArrayBuffer;
	let pointCount = 0;

	const MIN_X = 115;
	const MAX_X = 151;
	const MIN_Y = 88;
	const MAX_Y = 109;

	const pixelsToWebGLMatrix = new Float32Array(16);
	const mapMatrix = new Float32Array(16);

	const resolutionScale = window.devicePixelRatio || 1;

	let psize = 0;
	let pdir = 1;

	function init() {

		// initialize the canvasLayer
		const canvasLayerOptions = {
			map: map,
			resizeHandler: resize,
			animate: false,
			updateHandler: update,
			resolutionScale: resolutionScale
		};

		canvasLayer = new CanvasLayer(canvasLayerOptions);

		// initialize WebGL
		gl = createContext(canvasLayer.canvas, {
			premultipliedAlpha: false,
			antialiasing: true
		}, function render() {
			// request animation frame
		});

		let pulseTexture = new Image();
		pulseTexture.onload = () => {
			let tex = createTex(gl, pulseTexture, gl.RGBA);
			tex.generateMipmap();
			textures.push(tex);
			createShaderProgram();
			loadData();
			setBlendModes();
			glReady = true;
		}

		pulseTexture.src = "/img/blip-texture.png";

	}


	function setBlendModes() {
		gl.blendEquationSeparate( gl.FUNC_ADD, gl.FUNC_ADD );
		gl.blendFuncSeparate( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE );

		gl.enable(gl.BLEND);
		gl.disable(gl.DEPTH_TEST)
		gl.depthFunc(gl.LEQUAL);
	}

	function createShaderProgram() {
		shader = createShader(gl, vertShader, fragShader);
	}

	function loadData() {
		// this data could be loaded from anywhere, but in this case we'll
		// generate some random x,y coords in a world coordinate bounding box
		const rawData = [];
		for (let p in munged) {
			let mPoint = munged[p];
			if (mPoint.lonlat[0] != null) {
				const point = latLongToMercator(mPoint.lonlat[1], mPoint.lonlat[0]);
				rawData.push(point[0], point[1]);
				pointCount++;
				// if (POINT_COUNT === 4) console.log(mPoint);
			}
		}

		sizes = new Float32Array(pointCount);

		let raw = new Float32Array(rawData);
		shader.bind();
		// create webgl buffer, bind it, and load rawData into it
		pointArrayBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, pointArrayBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, raw, gl.STATIC_DRAW);

		// enable the 'worldCoord' attribute in the shader to receive buffer
		const attributeLoc = shader.attributes.worldCoord.location;

		gl.enableVertexAttribArray(attributeLoc);

		// tell webgl how buffer is laid out (pairs of x,y coords)
		gl.vertexAttribPointer(attributeLoc, 2, gl.FLOAT, false, 0, 0);

		sizeArrayBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, sizeArrayBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sizes), gl.DYNAMIC_DRAW);
	}

	function resize() {
		const width = canvasLayer.canvas.width;
		const height = canvasLayer.canvas.height;

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
		matrix[12] += matrix[0] * tx + matrix[4] * ty;
		matrix[13] += matrix[1] * tx + matrix[5] * ty;
		matrix[14] += matrix[2] * tx + matrix[6] * ty;
		matrix[15] += matrix[3] * tx + matrix[7] * ty;
	}

	let sizeIdx = 0;

	function getBaseLog(x, y) {
		if (y>1) y += 10;
		return Math.log(y) / Math.log(x);
	}

	function rollingAverage(current, next, samples) {
		samples = samples || 5;
		return ((current * (samples - 1)) + next) / samples
	}

	function updateSizes() {
		if (!glReady) return;
		let simulationCurrentHour = controller.get("app.hours");
		let ix = 0;
		for (let p in munged) {
			let mPoint = munged[p];
			if (mPoint.lonlat[0] != null) {
				let offset = simulationCurrentHour - mPoint.begin;
				if (mPoint.begin > simulationCurrentHour) {
					sizes[ix] = 0;
				} else if (mPoint.hits[offset]) {
					// add the hit count
					let hit = mPoint.hits[offset];
					hit += (hit > 1) ? 500 : 0;
					hit /= 2048;
					sizes[ix] = rollingAverage(sizes[ix], hit);
				} else {
					sizes[ix] = 0;
				}
				ix++;
			}
		}
	}

	controller.on('change', (changes) => {
		updateSizes();
		update();
	});

	function update() {
		if (!glReady) return;
		// get data for this frame
		gl.clear(gl.COLOR_BUFFER_BIT);
		const mapProjection = map.getProjection();


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
		const scale = Math.pow(2, map.zoom);
		scaleMatrix(mapMatrix, scale, scale);

		// translate to current view (vector from topLeft to 0,0)
		const offset = mapProjection.fromLatLngToPoint(canvasLayer.getTopLeft());
		translateMatrix(mapMatrix, -offset.x, -offset.y);

		// attach matrix value to 'mapMatrix' uniform in shader
		shader.uniforms.mapMatrix = mapMatrix
		shader.uniforms.psize = Math.pow(1.25, map.zoom + 10);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textures[0].handle);

		// if (this.shader.attributes.start) {
		// 	GL.bindBuffer(GL.ARRAY_BUFFER, this.buffers.start);
		// 	GL.vertexAttribPointer(this.shader.attributes.start.location, 1, GL.FLOAT, false, 0, 0);
		// 	GL.enableVertexAttribArray(this.shader.attributes.start.location);
		// }

		gl.bindBuffer(gl.ARRAY_BUFFER, sizeArrayBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.DYNAMIC_DRAW);
		gl.vertexAttribPointer(shader.attributes.size.location, 1, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shader.attributes.size.location);

		gl.bindBuffer(gl.ARRAY_BUFFER, pointArrayBuffer);
		gl.vertexAttribPointer(shader.attributes.worldCoord.location, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shader.attributes.worldCoord.location);

		// draw!
		gl.drawArrays(gl.POINTS, 0, pointCount);

	}

	init();
}

