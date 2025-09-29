module.exports = (sequelize, DataTypes) => {
	const Company = sequelize.define('Company', {
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING(60),
			allowNull: false,
			validate: {
				notNull: { msg: 'El nombre de la empresa es obligatorio' },
				notEmpty: { msg: 'El nombre de la empresa está vacío' }
			}
		},
		postal_code: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			validate: {
				notNull: { msg: 'El código postal es obligatorio' },
				isInt: { msg: 'El código postal debe ser un número' },
				is5Digits(value) {
					if(!/^\d{5}$/.test(value)) throw new Error('El código postal debe tener 5 cifras');
				}
			}
		},
		address: {
			type: DataTypes.STRING(150),
			allowNull: false,
			validate: {
				notNull: { msg: 'La dirección es obligatoria' },
				notEmpty: { msg: 'La dirección está vacía' }
			}
		},
		state: {
			type: DataTypes.STRING(40),
			allowNull: false,
			validate: {
				notNull: { msg: 'La provincia es obligatoria' },
				notEmpty: { msg: 'La provincia está vacía' }
			}
		},
		CIF: {
			type: DataTypes.CHAR(9),
			allowNull: false,
			unique: { msg: 'Este CIF ya está registrado' },
			validate: {
				notNull: { msg: 'El CIF es obligatorio' },
				validCIF(cif) {
					if(!cif || typeof cif != "string" || cif.length != 9) throw new Error('El CIF debe tener 9 caracteres');
					if(
						(!/^[A-HJNP-SU-W]\d{7}[0-9A-J]$/.test(cif)) ||
						((cif.substring(1,3) === "00" || /[NP-SW]/.test(cif[0])) && !/[A-J]/.test(cif[8])) ||
						(/[ABEH]/.test(cif[0]) && !/\d/.test(cif[8]))
				 	) throw new Error('El CIF es inválido');

					let control = cif[8];
					if(/[A-J]/.test(control)) control = (cif[8].charCodeAt(0)-54)%10;
					const sumEven = (+cif[2]) + (+cif[4]) + (+cif[6]);
					let sumOdd = 0;
					for(let i = 1; i <= 7; i+=2) {
						const prod = 2*(+cif[i]);
						sumOdd += prod < 10 ? prod:prod-9;
					}
					const res = (10-(sumEven + sumOdd)%10)%10;
					if(res != control) throw new Error('El CIF es inválido');
				}
			}
		},
		subscription_active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		payment_entity: {
			type: DataTypes.STRING(30),
			allowNull: false,
			validate: {
				notNull: { msg: 'La entidad de pago es obligatoria' },
				notEmpty: { msg: 'La entidad de pago está vacía' }
			}
		}
	}, {
		tableName: 'companies',
		timestamps: true
	});

	Company.associate = (models) => {
		Company.hasMany(models.Driver, { foreignKey: 'company_id' });
		Company.hasMany(models.Vehicle, { foreignKey: 'company_id' });
		Company.hasOne(models.User, { foreignKey: 'company_id' });
	};

	return Company;
}