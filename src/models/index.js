'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = require('../config/env.js');
const db = {};

let sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
  host: env.db.host,
  port: env.db.port,
  dialect: env.db.dialect,
  logging: env.db.logging,
  dialectOptions: { multipleStatements: false },
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      !file.startsWith('.') &&
      file !== basename &&
      file.endsWith('.js') &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
