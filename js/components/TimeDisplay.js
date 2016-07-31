import React from "react";
import {connect as Cerebral} from "cerebral-view-react";
import {startTimer} from "../lib/timer.js";

@Cerebral({
	date: "app.date"
})
export default class TimeDisplay extends React.Component {
	componentDidMount() {
		startTimer(this.props.signals.app.timeUpdated, this.props.date);
	}

	render() {
		return (
			<div>this.props.date</div>
		);
	}
}
