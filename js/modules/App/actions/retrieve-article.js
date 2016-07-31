const fs = require("fs");

const article = JSON.parse(fs.readFileSync("data/sample-article.json", "utf8"));

// When importing articles is possble, use an async version of this action
// to retrieve data for selected article

export function retrieveArticle({input, state}) {

	const showArticle = Boolean(input.showArticle);

	if (showArticle) {
		state.set("app.article", article);
	}
	
	state.set("app.showArticle", showArticle);
}

