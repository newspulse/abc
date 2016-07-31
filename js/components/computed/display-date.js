import moment from "moment";
import {Computed} from "cerebral";

export const displayDate = Computed({
	date: "app.date"
}, props => {
	const date = moment(props.date);

	return {
		date: date.format("DD MMMM"),
		time: date.format("h:mm A")
	};
});
