import {connect as Cerebral} from "cerebral-view-react";
import React from "react";
import {DataGraph} from "./DataGraph.js";

export default class App extends React.Component {
	render() {
		return (
			<div className="app">
				{"Hai"}
				<DataGraph />
			</div>
		);
	}
}
