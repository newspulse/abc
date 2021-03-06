import React from "react";
import Moment from "moment";
import AmCharts from "../lib/amcharts/index";
import DayMarker from "./DayMarker";
import CoburgRallyMarker from "./CoburgRallyMarker";

var fs = require("fs");
const mayData = JSON.parse(fs.readFileSync("data/ABCTrafficPerDay.json", "utf8"));

export default class DataGraph extends React.Component {
	componentDidMount() {

		// SERIAL CHART
		const chart = new AmCharts.AmSerialChart();

		chart.dataProvider = mayData;
		chart.categoryField = "Day";
		chart.color = "#FFFFFF";
		chart.fontFamily = "Helvetica, Arial, sans-serif";

		// data updated event will be fired when chart is first displayed,
		// also when data will be updated. We'll use it to set some
		// initial zoom
		chart.addListener("dataUpdated", this.zoomChart);
		chart.addListener("clickGraphItem", this.handleClick);

		// AXES
		// Category
		const categoryAxis = chart.categoryAxis;
		// categoryAxis.parseDates = true; // in order char to understand dates, we should set parseDates to true
		//categoryAxis.minPeriod = "mm"; // as we have data with minute interval, we have to set "mm" here.
		categoryAxis.gridAlpha = 0.07;
		categoryAxis.gridColor = "#FFFFFF";
		categoryAxis.axisColor = "#555555";
		categoryAxis.title = "May 2016";

		// Value
		const valueAxis = new AmCharts.ValueAxis();
		valueAxis.gridAlpha = 0.07;
		valueAxis.gridColor = "#FFFFFF";
		valueAxis.title = "Total article hits per day";
		chart.addValueAxis(valueAxis);

		// GRAPH
		const graph = new AmCharts.AmGraph();
		graph.type = "line"; // try to change it to "column"
		graph.title = "red line";
		graph.valueField = "Traffic Count";
		graph.lineAlpha = 1;
		graph.lineColor = "#80CBC4";
		graph.fillAlphas = 0.3; // setting fillAlphas to > 0 value makes it area graph
		chart.addGraph(graph);

		// CURSOR
		const chartCursor = new AmCharts.ChartCursor();
		chartCursor.cursorPosition = "mouse";
		chartCursor.categoryBalloonDateFormat = "JJ:NN, DD MMMM";
		chart.addChartCursor(chartCursor);
		// WRITE
		chart.write("np_graph");
	}

	shouldComponentUpdate() {
		return false;
	}

	handleClick(event) {
		alert(event.item.dataContext.linky + " Hello!");
	}

	formatBalloon(graphDataItem) {
		return Math.round(graphDataItem.values.value).toString();
	}

	zoomChart() {
		// different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
		// chart.zoomToIndexes(chartData.length - 40, chartData.length - 1);
	}

	generateChartData() {
		// FIX DATE STUFF
		// current date
		const firstDate = new Date();
		// now set 1000 minutes back
		firstDate.setMinutes(firstDate.getDate() - 1000);

		const chartData = [];

		// and generate 1000 data items
		for (let i = 0; i < 1000; i++) {
			const newDate = new Date(firstDate);
			// each time we add one minute
			newDate.setMinutes(newDate.getMinutes() + i);
			// some random number
			const visits = Math.round(Math.random() * 40) + 10;
			// add data item to the array
			chartData.push({
				date: newDate,
				visits: visits,
				linky: `whooooo!!! ${i}`
			});
		}

		return chartData;
	}

	render() {
		return (
			<div className="np-graph-container">
				<div id="np_graph"></div>
				<DayMarker />
				<CoburgRallyMarker />
			</div>
		);
	}
}
