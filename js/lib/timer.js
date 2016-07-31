import moment from "moment";

let tickInterval;

let tick = () => {};

export function startTimer(props) {
	const {timeUpdated} = props.signals.app;

	const {date} = props;

	const startDate = moment(date);

	let timerDate = moment(date);

	timerDate.add(1, "hour");

	tick = () => {
		timeUpdated({
			date: timerDate.format(),
			hours: timerDate.diff(startDate, "hours")
		});

		timerDate.add(1, "hour");

		if (timerDate.month() !== startDate.month()) {
			clearTick();
			timerDate = moment(date);
			addTick();
		}
	};
	setTimeout(() => {
		addTick();
	}, 2000);
}


function clearTick() {
	clearInterval(tickInterval);
	tickInterval = null;
}

function addTick() {
	tickInterval = setInterval(() => {
		tick();
	}, 50);
}

export function pauseTimer(paused) {
	if (paused && tickInterval) {

		clearTick();

	} else if (!paused && !tickInterval) {

		addTick();
	}
}
