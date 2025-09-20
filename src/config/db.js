import { Sequelize } from "sequelize";
import { env } from "./env.js";

export const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
  host: env.db.host,
  port: env.db.port,
  dialect: "mysql",
  logging: env.db.logging,
  dialectOptions: { multipleStatements: false },
});

export async function connectDB() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("✔ DB conectada");
  } catch (error) {
    console.error("❌ Error DB:", error.message);
    process.exit();
  }
}
