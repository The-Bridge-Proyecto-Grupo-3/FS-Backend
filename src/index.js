import express from "express";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import { connectDB } from "./config/db.js";
import morgan from "morgan";

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(morgan('tiny'));

app.use("/users", usersRoutes);
app.use("/auth", authRoutes);

(async () => {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`Server started on port ${env.port}`);
  });
})();
