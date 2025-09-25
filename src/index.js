const express = require("express");
const env = require("./config/env");
const connectDB = require("./config/db");
const morgan = require("morgan");
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

if(env.nodeEnv === "development") {
  const swaggerUi = require("swagger-ui-express");
  const apiSpec = require('../docs/api');
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSpec));
  console.log("Swagger loaded");
}

app.use(express.json({ limit: '10kb' }));
app.use(morgan('tiny'));

app.use(cors({
  origin: env.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(cookieParser());

fs
  .readdirSync(path.join(__dirname, 'routes'))
  .forEach(file => {
    const route = file.endsWith(".js") ? file.slice(0,-3):file;
    const routeImport = require(`./routes/${route}`);
    if(typeof routeImport !== 'function') 
      throw new Error(`Undefined router: /${route}`);
    app.use(`/${route}`, routeImport);
  });

(async () => {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`Server started on port ${env.port}`);
  });
})();
