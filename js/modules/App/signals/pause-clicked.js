import {copy} from "cerebral/operators";

export const pauseClicked = [
	copy("input:paused", "state:app.paused")
];
