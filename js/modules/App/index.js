import moment from "moment";
import {timeUpdated} from "./signals/time-updated.js";
import {articleClicked} from "./signals/article-clicked.js";
import {pauseClicked} from "./signals/pause-clicked.js";

const date = moment({
	year: 2016,
	month: 4,
	day: 1,
	hour: 0
});

export default module => {

	module.addState({
		stateWorks: true,
		graphOpen: true,
		date: date.format(),
		hours: 0,
		paused: false,
		article: null,
		showArticle: false
	});

	module.addSignals({
		timeUpdated,
		articleClicked,
		pauseClicked
	});
};
