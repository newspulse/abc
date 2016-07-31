import React from "react";
import {connect as Cerebral} from "cerebral-view-react";

@Cerebral({
})
export default class CoburgRallyMarker extends React.Component {
	componentDidMount() {
	}

	handleClick() {
		this.props.signals.app.articleClicked({showArticle: true});
	}

	render() {
		return (
			<div id="rally-marker" onClick={this.handleClick.bind(this)}>Coburg Rallies<div className="line"></div></div>
		);
	}
}
