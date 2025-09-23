const express = require("express");
const env = require("./config/env");
const connectDB = require("./config/db");
const morgan = require("morgan");

const app = express();

if(env.nodeEnv === "development") {
  const swaggerUi = require("swagger-ui-express");
  const apiSpec = require('../docs/api');
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSpec));
  console.log("Swagger loaded");
}

app.use(express.json({ limit: '10kb' }));
app.use(morgan('tiny'));

app.use("/users", require("./routes/users"));
app.use("/auth", require("./routes/auth"));

(async () => {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`Server started on port ${env.port}`);
  });
})();
