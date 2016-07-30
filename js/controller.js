import {Controller} from "cerebral";
import Model from "cerebral/models/immutable";
import Devtools from "cerebral-module-devtools";
import App from "./modules/App";
import ModulesProvider from "cerebral-provider-modules";

const controller = Controller(
	Model({}, {
		immutable: false
	})
);

controller.addContextProvider(ModulesProvider);

controller.addModules({
	app: App,
	devtools: Devtools()
});

export default controller;
