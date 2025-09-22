module.exports = (sequelize, DataTypes) => {
	const Refuelling = sequelize.define('Refuelling', {
		driver_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			primaryKey: true,
			allowNull: false
		},
		vehicle_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			primaryKey: true,
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
		},
		date: {
			type: DataTypes.DATE,
			allowNull: false
		}
	}, {
		tableName: 'refuelling',
		timestamps: false
	});

	Refuelling.associate = (models) => {
		Refuelling.belongsTo(models.Driver, {
			foreignKey: 'driver_id'
		});
		Refuelling.belongsTo(models.Vehicle, {
			foreignKey: 'vehicle_id'
		});
	};

	return Refuelling;
};