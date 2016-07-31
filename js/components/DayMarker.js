import React from "react";
import {connect as Cerebral} from "cerebral-view-react";
import {startTimer, pauseTimer} from "../lib/timer.js";

import {displayDate} from "./computed/display-date.js";

@Cerebral({
	date: "app.hours",
})
export default class DayMarker extends React.Component {
	componentDidMount() {
		// startTimer(this.props);
	}

	render() {
		const {
			date
		} = this.props;

		const offset = (date/744)*665 + 104;
		return (
			<div id="time-line" style={{left: offset + 'px'}}></div>
		);
	}
}
