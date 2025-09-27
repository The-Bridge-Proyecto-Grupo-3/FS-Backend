const { sequelize } = require("../models");

module.exports = async function connectDB() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("✔ DB conectada");
  } catch (error) {
    console.error("❌ Error DB:", error);
    process.exit();
  }
}