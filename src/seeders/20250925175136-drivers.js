'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const companies = await queryInterface.sequelize.query(`SELECT id FROM companies;`);
    const companyRows = companies[0];

    const drivers = [];
    let driverCounter = 1;

    for (const company of companyRows) {
      for (let i = 0; i < 2; i++) {
        drivers.push({
          first_name: `Driver${driverCounter}`,
          last_name: `Lastname${driverCounter}`,
          company_id: company.id,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        driverCounter++;
      }
    }

    await queryInterface.bulkInsert('drivers', drivers);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('drivers', null, {});
  }
};
