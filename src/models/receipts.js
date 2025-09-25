module.exports = (sequelize, DataTypes) => {
	const Receipt = sequelize.define('Receipt', {
		driver_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			primaryKey: true,
			allowNull: false,
			references: {
				model: 'drivers',
				key: 'id',
			},
		},
		vehicle_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			primaryKey: true,
			allowNull: false,
			references: {
				model: 'vehicles',
				key: 'id',
			},
		},
		price: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		},
		quantity: {
			type: DataTypes.FLOAT.UNSIGNED,
			allowNull: true
		},
		mileage: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true
		}
	}, {
		tableName: 'receipts',
		timestamps: true
	});

	Receipt.associate = (models) => {
		Receipt.belongsTo(models.Driver, { foreignKey: 'driver_id' });
		Receipt.belongsTo(models.Vehicle, { foreignKey: 'vehicle_id'});
	};

	return Receipt;
}