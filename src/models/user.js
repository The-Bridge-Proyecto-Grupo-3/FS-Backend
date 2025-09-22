import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const User = sequelize.define(
	"User",
	{
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		email: {
			type: DataTypes.STRING(190),
			allowNull: false,
			validate: { isEmail: true }
		},
		role: {
			type: DataTypes.ENUM("admin","company","driver"),
			allowNull: false,
			defaultValue: "company",
		},
		company_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
			references: {
				model: 'companies',
				key: 'id',
			},
		},
		driver_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
			references: {
				model: 'drivers',
				key: 'id',
			},
		},
		passwordHash: {
			type: DataTypes.CHAR(60),
			allowNull: false,
		},
		twoFactorEnabled: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		twoFactorSecret: {
			type: DataTypes.CHAR(32),
			allowNull: true,
		},
		twoFactorGeneratedAt: {
			type: DataTypes.DATE,
			allowNull: true
		},
		emailVerified: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		emailVerifiedAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		tableName: "users",
		paranoid: true,
		indexes: [{ unique: true, fields: ["email"] }, { fields: ["role"] }],
	}
);

User.associate = (models) => {
	User.belongsTo(models.Driver, { foreignKey: 'driver_id' });
	User.belongsTo(models.Company, { foreignKey: 'company_id' });
};

export default User;