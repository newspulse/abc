import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import controller from "./controller.js";
import {initMap} from "./lib/gl/visualization.js";
import {Container} from 'cerebral-view-react'

initMap();

ReactDOM.render(<Container controller={controller}><App /></Container>, document.getElementById("ui"));
