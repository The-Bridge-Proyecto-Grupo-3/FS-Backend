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
		fuel_type: {
			type: DataTypes.ENUM('95','98','diesel','glp','electric'),
			allowNull: false
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
		timestamps: true,
		indexes:[{ unique: false, fields:['fuel_type'] }]
	});

	Receipt.associate = (models) => {
		Receipt.belongsTo(models.Driver, { foreignKey: 'driver_id' });
		Receipt.belongsTo(models.Vehicle, { foreignKey: 'vehicle_id'});
	};

	return Receipt;
}