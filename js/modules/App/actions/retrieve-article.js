const fs = require("fs");

const article = JSON.parse(fs.readFileSync("data/sample-article.json", "utf8"));

// When importing articles is possble, use an async version of this action
// to retrieve data for selected article

export function retrieveArticle({state}) {
	state.set("app.article", article);
}

