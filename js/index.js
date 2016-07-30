import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import controller from "./controller";
import Moment from "moment";
import {initMap} from "./lib/gl/visualization";

initMap();

const draw = () => {
	console.log(Date.now());

	requestAnimationFrame(draw);
};

//draw();

ReactDOM.render(<App controller={controller} />, document.getElementById("ui"));