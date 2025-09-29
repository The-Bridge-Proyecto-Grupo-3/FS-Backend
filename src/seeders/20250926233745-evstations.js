'use strict';
const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

module.exports = {
  async up (queryInterface, Sequelize) {
    const stations = [];
    let i = 1;
    const filePath = path.resolve(__dirname,'PuntosCarga.csv');
    fs.createReadStream(filePath).pipe(
      parse({
        columns: true,
        delimiter: '|',
        quote: false
      }).on('data', (row) => {
        row.id = i++;
        row.max_power *= 1000;
        stations.push(row)
      }).on("error", function (err) {
        console.error(err.message);
      }).on("end", async () => {
        await queryInterface.bulkInsert('evstations', stations);
      })
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('evstations', null, {});
  }
};
