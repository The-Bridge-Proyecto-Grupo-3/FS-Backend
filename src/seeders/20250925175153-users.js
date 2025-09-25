'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const passwordHash = () => bcrypt.hashSync('123456', 12);

    const companies = await queryInterface.sequelize.query(`
      SELECT id FROM companies ORDER BY id ASC;
    `);
    const drivers = await queryInterface.sequelize.query(`
      SELECT id FROM drivers ORDER BY id ASC;
    `);

    const companyRows = companies[0];
    const driverRows = drivers[0];

    const users = [];

    // Admin user (not tied to any company or driver)
    users.push({
      email: 'admin@mail.com',
      passwordHash: passwordHash(),
      role: 'admin',
      company_id: null,
      driver_id: null,
      emailVerified: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Company users
    companyRows.forEach((company, i) => {
      const companyNumber = (i + 1).toString().padStart(2, '0');
      users.push({
        email: `company${companyNumber}@mail.com`,
        passwordHash: passwordHash(),
        role: 'company',
        company_id: company.id,
        driver_id: null,
        emailVerified: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    // Driver users
    driverRows.forEach((driver, i) => {
      const driverNumber = (i + 1).toString().padStart(2, '0');
      users.push({
        email: `driver${driverNumber}@mail.com`,
        passwordHash: passwordHash(),
        role: 'driver',
        company_id: null,
        driver_id: driver.id,
        emailVerified: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    await queryInterface.bulkInsert('users', users);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
