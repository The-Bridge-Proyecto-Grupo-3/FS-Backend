module.exports = (sequelize, DataTypes) => {
	const EVStation = sequelize.define('EVStation', {
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true
		},
		operator: {
			type: DataTypes.STRING(60),
			allowNull: false
		},
		address: {
			type: DataTypes.STRING(150),
			allowNull: false
		},
		postal_code: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		},
		state: {
			type: DataTypes.STRING(40),
			allowNull: false
		},
		city: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		location: {
			type: DataTypes.STRING(50),
			allowNull: false
		},
		latitude: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		longitude: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		max_power: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		tableName: 'evstations',
		timestamps: false,
		indexes: [
			{ unique: false, fields: ['latitude','longitude']}
		]
	});

	return EVStation;
}