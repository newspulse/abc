import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import controller from "./lib/controller";

window.initMap = function() {
	var mapDiv = document.getElementById('map');
	var map = new google.maps.Map(mapDiv, {
		center: {lat: -27.68, lng: 134.78},
		zoom: 4
	});
}

ReactDOM.render(<App controller={controller} />, document.getElementById("ui"));