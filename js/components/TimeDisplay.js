import React from "react";
import {connect as Cerebral} from "cerebral-view-react";
import {startTimer} from "../lib/timer.js";

import {displayDate} from "./computed/display-date.js";

@Cerebral({
	date: "app.date",
	displayDate: displayDate()
})
export default class TimeDisplay extends React.Component {
	componentDidMount() {
		startTimer(this.props.signals.app.timeUpdated, this.props.date);
	}

	render() {
		return (
			<div id="time-display">
				<h2>{this.props.displayDate.date}</h2>
				<h2>{this.props.displayDate.time}</h2>
			</div>
		);
	}
}
