import React from "react";
import {connect as Cerebral} from "cerebral-view-react";
import {startTimer, pauseTimer} from "../lib/timer.js";

import {displayDate} from "./computed/display-date.js";

@Cerebral({
	date: "app.date",
	displayDate: displayDate(),
	paused: "app.paused"
})
export default class TimeDisplay extends React.Component {
	componentDidMount() {
		startTimer(this.props);
	}

	togglePause() {
		this.props.signals.app.pauseClicked({paused: !this.props.paused});
	}

	componentWillReceiveProps(newProps) {
		if (this.props.paused !== newProps.paused) {
			pauseTimer(newProps.paused);
		}
	}

	render() {
		const {
			displayDate,
			paused
		} = this.props;

		return (
			<div id="time-display">
				<h2>{displayDate.date}</h2>
				<h2>{displayDate.time}</h2>
				<button id="button-pause" onClick={this.togglePause.bind(this)}>
					{paused ? "Play" : "Pause"}
				</button>
			</div>
		);
	}
}
