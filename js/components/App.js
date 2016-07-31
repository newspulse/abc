import React from "react";
import {connect as Cerebral} from "cerebral-view-react";
import DataGraph from "./DataGraph.js";
import ArticlePanel from "./ArticlePanel.js";
import TimeDisplay from "./TimeDisplay.js";

@Cerebral({
	graphOpen: "app.graphOpen"
})
export default class App extends React.Component {
	render() {
		return (
			<div className="app">
				<div className="np-logo"></div>
				{this.props.graphOpen ?
					<DataGraph /> :
					null
				}
				<ArticlePanel />
				<TimeDisplay />
			</div>
		);
	}
}
