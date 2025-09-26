const env = require("./config/env");
const connectDB = require('./config/db');
const { sequelize, Sequelize } = require('./models');

// Import all seeders
const seedCompanies = require('./seeders/20250925175148-companies');
const seedDrivers = require('./seeders/20250925175136-drivers');
const seedVehicles = require('./seeders/20250925175205-vehicles');
const seedUsers = require('./seeders/20250925175153-users');

async function runSeeders() {
  await connectDB(); // Connect and sync DB
  const queryInterface = sequelize.getQueryInterface();

  const seedEVStations = require('./seeders/20250926233745-evstations');
  await seedEVStations.up(queryInterface, Sequelize);

  try {
    console.log('⏳ Seeding companies...');
    await seedCompanies.up(queryInterface, Sequelize);

    console.log('⏳ Seeding drivers...');
    await seedDrivers.up(queryInterface, Sequelize);

    console.log('⏳ Seeding vehicles...');
    await seedVehicles.up(queryInterface, Sequelize);

    console.log('⏳ Seeding users...');
    await seedUsers.up(queryInterface, Sequelize);

    console.log('✅ All seeders ran successfully.');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
	await seedCompanies.down(queryInterface, Sequelize);
	await seedDrivers.down(queryInterface, Sequelize);
	await seedVehicles.down(queryInterface, Sequelize);
	await seedUsers.down(queryInterface, Sequelize);
    process.exit(1);
  }
}

runSeeders();