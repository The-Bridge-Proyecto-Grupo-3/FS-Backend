module.exports = (sequelize, DataTypes) => {
	const Receipt = sequelize.define('Receipt', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
		},
		driver_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: 'drivers',
				key: 'id',
			},
		},
		vehicle_id: {
			type: DataTypes.INTEGER.UNSIGNED,
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
			allowNull: false,
			validate: {
				notNull: { msg: 'El precio es obligatorio' },
				isNumeric: { msg: 'El precio debe ser numérico' },
			}
		},
		quantity: {
			type: DataTypes.FLOAT.UNSIGNED,
			allowNull: false,
			validate: {
				notNull: { msg: 'La cantidad es obligatoria' },
				isNumeric: { msg: 'La cantidad debe ser numérica' },
			}
		},
		mileage: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			validate: {
				notNull: { msg: 'El kilometraje es obligatorio' },
				isNumeric: { msg: 'El kilometraje debe ser numérico' },
			}
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