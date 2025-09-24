module.exports = (sequelize, DataTypes) => {
	const Company = sequelize.define('Company', {
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING(60),
			allowNull: false
		},
		postal_code: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		},
		address: {
			type: DataTypes.STRING(150),
			allowNull: false
		},
		state: {
			type: DataTypes.STRING(40),
			allowNull: false
		},
		CIF: {
			type: DataTypes.CHAR(9),
			allowNull: false,
			unique: true,
			validate: {
				validCIF(cif) {
					if(!cif || typeof cif != "string" || cif.length != 9) return false;
					if(!/^[A-HJNP-SU-W]\d{7}[0-9A-J]$/.test(cif)) return false;
					if((cif.substring(1,3) === "00" || /[NP-SW]/.test(cif[0])) && !/[A-J]/.test(cif[8])) return false;
					if(/[ABEH]/.test(cif[0]) && !/\d/.test(cif[8])) return false;

					let control = cif[8];
					if(/[A-J]/.test(control)) control = (cif[8].charCodeAt(0)-54)%10;
					const sumEven = (+cif[2]) + (+cif[4]) + (+cif[6]);
					let sumOdd = 0;
					for(let i = 1; i <= 7; i+=2) {
						const prod = 2*(+cif[i]);
						sumOdd += prod < 10 ? prod:prod-9;
					}
					const res = (10-(sumEven + sumOdd)%10)%10;
					return res == control;
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
			allowNull: false
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