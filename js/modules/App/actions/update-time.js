export function updateTime({input, state}) {
	state.set("app.date", input.date);
	state.set("app.hours", input.hours);
}
