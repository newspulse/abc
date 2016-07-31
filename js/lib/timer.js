import moment from "moment";

export function startTimer(signal, date) {

	const startDate = moment(date);

	const timerDate = moment(date);

	timerDate.add(1, "hour");

	let tickInterval;

	const tick = () => {
		signal({
			date: timerDate.format(),
			hours: timerDate.diff(startDate, "hours")
		});

		timerDate.add(1, "hour");

		if (timerDate.month() !== startDate.month()) {
			clearInterval(tickInterval);
		}
	};

	tickInterval = setInterval(() => {
		tick();
	}, 1000);
}
