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
			allowNull: false,
			validate: {
				notNull: { msg: 'La marca es obligatoria' },
				notEmpty: { msg: 'La marca está vacía' },
			}
		},
		model: {
			type: DataTypes.STRING(60),
			allowNull: false,
			validate: {
				notNull: { msg: 'El modelo es obligatorio' },
				notEmpty: { msg: 'El modelo está vacío' },
			}
		},
		license_plate: {
			type: DataTypes.CHAR(8),
			allowNull: false,
			unique: { msg: 'Esta matrícula ya está registrada' },
			validate: {
				notNull: { msg: 'La matrícula es obligatoria' },
				notEmpty: { msg: 'La matrícula está vacía' },
			}
		},
		registration_date: {
			type: DataTypes.DATEONLY,
			allowNull: false,
			validate: {
				notNull: { msg: 'La fecha de registro es obligatoria' },
				isDate: { msg: 'La fecha de registro es inválida' },
			}
		},
		type: {
			type: DataTypes.ENUM('gas', 'electric'),
			allowNull: false
		},
		in_use_by: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
			unique: { msg: 'Este vehículo ya está asignado' },
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
		Vehicle.hasMany(models.Receipt, { foreignKey: 'vehicle_id' });
	};

	return Vehicle;
}