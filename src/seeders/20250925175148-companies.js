'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('companies', [
      {
        name: 'Transporte Alpha S.A.',
        postal_code: 28001,
        address: 'Calle de Alcalá 123',
        state: 'Madrid',
        CIF: 'D7521345D',
        subscription_active: true,
        payment_entity: 'CaixaBank',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Beta Transporte y Logística SL',
        postal_code: 46002,
        address: 'Avenida del Cid 45',
        state: 'Valencia',
        CIF: 'B23456783',
        subscription_active: true,
        payment_entity: 'Santander',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Gamma Mudanzas y Transportes',
        postal_code: 48005,
        address: 'Calle Gran Vía 89',
        state: 'Bizkaia',
        CIF: 'J3292121E',
        subscription_active: true,
        payment_entity: 'BBVA',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('companies', null, {});
  }
};