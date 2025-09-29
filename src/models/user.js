module.exports = (sequelize, DataTypes) => {
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
				unique: { msg: 'Este correo ya está registrado' },
				validate: {
					notNull: { msg: 'El correo es obligatorio' },
					notEmpty: { msg: 'El correo está vacío' },
					isEmail: { msg: 'El correo es inválido' }
				}
			},
			role: {
				type: DataTypes.ENUM("admin","company","driver"),
				allowNull: false
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
			validate: {
				validRole() {
					if(this.role === "admin" && (this.company_id || this.driver_id)) throw new Error("Admin cannot be linked to a company or driver");
					if(this.role === "company" && (!this.company_id || this.driver_id)) throw new Error("Company cannot be linked to a driver");
					// driver user can be unlinked from driver when it is first created
					if(this.role === "driver" && this.company_id) throw new Error("Driver cannot be linked to a company");
				}
			}
		}
	);

	User.associate = (models) => {
		User.belongsTo(models.Driver, { foreignKey: 'driver_id' });
		User.belongsTo(models.Company, { foreignKey: 'company_id' });
	};

	return User;
}