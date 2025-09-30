'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const drivers = await queryInterface.sequelize.query(`SELECT id, company_id FROM drivers;`);
    const driverRows = drivers[0];

    const vehicleData = {
      'SEAT': ['Ibiza', 'Leon', 'Arona', 'Ateca'],
      'Peugeot': ['208', '308', 'Partner', 'Rifter'],
      'Citroën': ['Berlingo', 'C3', 'C4', 'Jumpy'],
      'Renault': ['Clio', 'Megane', 'Kangoo', 'Trafic'],
      'Fiat': ['Panda', '500', 'Ducato', 'Doblo'],
      'Opel': ['Corsa', 'Combo', 'Vivaro', 'Astra'],
      'Volkswagen': ['Golf', 'Polo', 'Caddy', 'Transporter'],
      'Ford': ['Fiesta', 'Focus', 'Transit Connect', 'Transit Custom'],
      'Skoda': ['Fabia', 'Octavia', 'Superb', 'Scala'],
      'Dacia': ['Sandero', 'Duster', 'Dokker', 'Lodgy'],
      'Mercedes-Benz': ['Citan', 'Vito', 'Sprinter', 'Clase A'],
    };

    const brands = Object.keys(vehicleData);
    const vehicles = [];

    driverRows.forEach((driver, i) => {
      for(let j = 0; j < 10; j++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const modelList = vehicleData[brand];
        const model = modelList[Math.floor(Math.random() * modelList.length)];
  
        vehicles.push({
          brand,
          model,
          license_plate: Math.floor(Math.random()*10000)+new Array(3).fill(0).map(_=> String.fromCharCode(Math.floor(65+Math.random()*26))).join(""),
          registration_date: new Date(),
          type: ['gas', 'electric'][i&1],
          in_use_by: j == 0 ? driver.id:null,
          company_id: driver.company_id,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    });

    await queryInterface.bulkInsert('vehicles', vehicles);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('vehicles', null, {});
  }
};
