const env = require("../src/config/env");
const connectDB = require('../src/config/db');
const { sequelize, Sequelize } = require('../src/models');

const seedEVStations = require('../src/seeders/20250926233745-evstations');
const seedCompanies = require('../src/seeders/20250925175148-companies');
const seedDrivers = require('../src/seeders/20250925175136-drivers');
const seedVehicles = require('../src/seeders/20250925175205-vehicles');
const seedUsers = require('../src/seeders/20250925175153-users');

async function runSeeders() {
  await connectDB();
  const queryInterface = sequelize.getQueryInterface();

  await deleteAll(queryInterface);

  try {
    console.log('⏳ Seeding EV stations...');
	await seedEVStations.up(queryInterface, Sequelize);

    console.log('⏳ Seeding companies...');
    await seedCompanies.up(queryInterface, Sequelize);

    console.log('⏳ Seeding drivers...');
    await seedDrivers.up(queryInterface, Sequelize);

    console.log('⏳ Seeding vehicles...');
    await seedVehicles.up(queryInterface, Sequelize);

    console.log('⏳ Seeding users...');
    await seedUsers.up(queryInterface, Sequelize);

    console.log('✅ All seeders ran successfully.');
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
	await deleteAll(queryInterface);
    process.exit(1);
  }
}

async function deleteAll(queryInterface) {
	await seedCompanies.down(queryInterface, Sequelize);
	await seedDrivers.down(queryInterface, Sequelize);
	await seedVehicles.down(queryInterface, Sequelize);
	await seedUsers.down(queryInterface, Sequelize);
	await seedEVStations.down(queryInterface, Sequelize);
}

runSeeders();