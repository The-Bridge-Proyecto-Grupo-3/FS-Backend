import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const User = sequelize.define(
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
			validate: { isEmail: true },
		},
		role: {
			type: DataTypes.ENUM("user", "admin"),
			allowNull: false,
			defaultValue: "user",
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