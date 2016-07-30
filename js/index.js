import React from "react";
import ReactDOM from "react-dom";


console.log("HELLO WORLD");

window.initMap = function() {
	var mapDiv = document.getElementById('map');
	var map = new google.maps.Map(mapDiv, {
		center: {lat: -27.68, lng: 134.78},
		zoom: 4
	});
}

//initMap();

// /ReactDOM.render(<Layout controller={controller} />, document.getElementById("spui"));