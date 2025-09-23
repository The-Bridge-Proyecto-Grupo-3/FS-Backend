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