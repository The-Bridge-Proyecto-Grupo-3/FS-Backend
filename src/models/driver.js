module.exports = (sequelize, DataTypes) => {
	const Driver = sequelize.define('Driver', {
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true
		},
		company_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: 'companies',
				key: 'id',
			},
		},
		first_name: {
			type: DataTypes.STRING(40),
			allowNull: false,
			validate: {
				notNull: { msg: 'El nombre es obligatorio' },
				notEmpty: { msg: 'El nombre está vacío' },
			}
		},
		last_name: {
			type: DataTypes.STRING(60),
			allowNull: false,
			validate: {
				notNull: { msg: 'El apellido es obligatorio' },
				notEmpty: { msg: 'El apellido está vacío' },
			}
		}
	}, {
		tableName: 'drivers',
		timestamps: true
	});

	Driver.associate = (models) => {
		Driver.belongsTo(models.Company, { foreignKey: 'company_id' });
		Driver.hasOne(models.Vehicle, { foreignKey: 'in_use_by' });
		Driver.hasOne(models.User, { foreignKey: 'driver_id' });
		Driver.hasMany(models.Receipt, { foreignKey: 'driver_id' });
	};

	return Driver;
}