const express = require("express");
const env = require("./config/env");
const connectDB = require("./config/db");
const morgan = require("morgan");

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(morgan('tiny'));

app.use("/users", require("./routes/users"));
app.use("/auth", require("./routes/auth"));
app.use("/vehicles", require("./routes/vehicles"));

(async () => {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`Server started on port ${env.port}`);
  });
})();
