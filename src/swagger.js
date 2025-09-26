const express = require("express");
const env = require('./config/env');

const app = express();

if(env.nodeEnv === "development") {
	const swaggerUi = require("swagger-ui-express");
	const apiSpec = require('../docs/api');
	app.use('/', swaggerUi.serve, swaggerUi.setup(apiSpec));
	console.log("Swagger loaded");
}

app.listen(env.port, () => {
	console.log(`Server started on port ${env.port}`);
});