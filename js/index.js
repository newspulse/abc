import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import controller from "./controller";
import Moment from "moment";

window.initMap = function() {
	var mapDiv = document.getElementById('map');
	var map = new google.maps.Map(mapDiv, {
		center: {lat: -27.68, lng: 134.78},
		zoom: 4
	});

	var coords = [
		{lat: -37.82107355, lng: 144.95516023}, // north west
		{lat: -37.8131744, lng: 144.95151243}, // south west
		{lat: -37.80754617, lng: 144.97133932}, // south east
		{lat: -37.81537811, lng: 144.97485838}  // north east
	];

	map.data.add({geometry: new google.maps.Data.Polygon([coords])});
}

const draw = () => {
	console.log(Date.now());

	requestAnimationFrame(draw);
};

//draw();

ReactDOM.render(<App controller={controller} />, document.getElementById("ui"));