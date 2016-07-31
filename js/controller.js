import {Controller} from "cerebral";
import Model from "cerebral/models/immutable";
import Devtools from "cerebral-module-devtools";
import App from "./modules/App";
import ModulesProvider from "cerebral-provider-modules";
import Http from "cerebral-module-http";

const controller = Controller(
	Model({}, {
		immutable: false
	})
);

controller.addContextProvider(ModulesProvider);

controller.addModules({
	app: App,
	devtools: Devtools(),
	http: Http({
		baseUrl: "https://content-api-govhack.abc-prod.net.au/v1/"
	})
});

export default controller;
