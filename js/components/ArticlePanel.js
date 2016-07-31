import React from "react";
import {connect as Cerebral} from "cerebral-view-react";
import moment from "moment";
import _ from "lodash";

@Cerebral({
	article: "app.article",
	showArticle: "app.showArticle"
})
export default class ArticlePanel extends React.Component {
	componentDidMount() {
		// this.props.signals.app.articleClicked();
	}

	handleClose() {
		this.props.signals.app.articleClicked(false);
	}

	handleArticleOpen() {
		window.location.href="/coburg";
	}

	render() {
		const {article, showArticle} = this.props;

		if (!showArticle) return null;

		const teaser = article.teaserTextPlain ? article.teaserTextPlain :
		article.shortTeaserTextPlain;

		let imageURL;

		if (article.thumbnailLink && article.thumbnailLink.imageLinks) {
			const largeImages = Object.keys(
				article.thumbnailLink.imageLinks
			).filter((key) => {
				return key.indexOf("large") === 0;
			});

			if (largeImages.length) {
				imageURL = article.thumbnailLink.imageLinks[largeImages[0]];
			}
		}

		return (
			<div id="article-panel" onClick={this.handleArticleOpen}>
				<div className="content">
					<div className="close" onClick={this.handleClose.bind(this)}>X</div>
					<h2 className="title">{article.title}</h2>
					<h3>{moment(article.date).format("DD MMMM YYYY h:mm A")}</h3>
					<p className="teaser">{teaser}</p>
					{imageURL ? (
						<img className="thumbnail" src={imageURL} />
					) : null}
				</div>
			</div>
		);
	}
}
