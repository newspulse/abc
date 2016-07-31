import moment from "moment";
import {timeUpdated} from "./signals/time-updated.js";

const date = moment({
	year: 2016,
	month: 4,
	day: 1,
	hour: 0
});

export default module => {

	module.addState({
		stateWorks: true,
		graphOpen: false,
		date: date.format(),
		hours: 0
	});

	module.addSignals({
		timeUpdated
	});
};
