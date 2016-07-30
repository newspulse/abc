import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import controller from "./controller.js";
import {initMap} from "./lib/gl/visualization.js";

initMap();

ReactDOM.render(<App controller={controller} />, document.getElementById("ui"));
