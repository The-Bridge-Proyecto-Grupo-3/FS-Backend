module.exports = (sequelize, DataTypes) => {
	const Vehicle = sequelize.define('Vehicle', {
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
		brand: {
			type: DataTypes.STRING(40),
			allowNull: false
		},
		model: {
			type: DataTypes.STRING(60),
			allowNull: false
		},
		license_plate: {
			type: DataTypes.CHAR(7),
			allowNull: false
		},
		registration_date: {
			type: DataTypes.DATEONLY,
			allowNull: false
		},
		type: {
			type: DataTypes.ENUM('gas', 'electric'),
			allowNull: true
		},
		in_use_by: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
			unique: true,
			references: {
				model: 'drivers',
				key: 'id',
			},
		}
	}, {
		tableName: 'vehicles',
		timestamps: true
	});

	Vehicle.associate = (models) => {
		Vehicle.belongsTo(models.Company, { foreignKey: 'company_id' });
		Vehicle.belongsTo(models.Driver, { foreignKey: 'in_use_by' });
	};

	return Vehicle;
}