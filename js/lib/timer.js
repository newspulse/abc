import moment from "moment";

let tickInterval;

let tick = () => {};

export function startTimer(props) {
	const {timeUpdated} = props.signals.app;

	const {date} = props;

	const startDate = moment(date);

	const timerDate = moment(date);

	timerDate.add(1, "hour");

	tick = () => {
		timeUpdated({
			date: timerDate.format(),
			hours: timerDate.diff(startDate, "hours")
		});

		timerDate.add(1, "hour");

		if (timerDate.month() !== startDate.month()) {
			clearTick();
		}
	};

	addTick();
}


function clearTick() {
	clearInterval(tickInterval);
	tickInterval = null;
}

function addTick() {
	tickInterval = setInterval(() => {
		tick();
	}, 1000);
}

export function pauseTimer(paused) {
	if (paused && tickInterval) {

		clearTick();

	} else if (!paused && !tickInterval) {

		addTick();
	}
}
