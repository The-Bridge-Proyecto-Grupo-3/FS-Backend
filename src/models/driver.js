module.exports = (sequelize, DataTypes) => {
  const Driver = sequelize.define('Driver', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    company_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(190),
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: DataTypes.CHAR(60),
      allowNull: false
    }
  }, {
    tableName: 'drivers',
    timestamps: true
  });

  Driver.associate = (models) => {
    Driver.belongsTo(models.Company, { foreignKey: 'company_id' });
    Driver.hasOne(models.Vehicle, { foreignKey: 'in_use_by' });
  };

  return Driver;
};