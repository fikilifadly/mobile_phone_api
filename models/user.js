"use strict";
const { Model } = require("sequelize");
const { hashPass } = require("../helpers");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			User.hasMany(models.Product, { foreignKey: "UserId" });
		}
	}
	User.init(
		{
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: "Username is required",
					},
					notEmpty: {
						msg: "Username is required",
					},
				},
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: {
					msg: "Email already registered",
				},
				validate: {
					notNull: {
						msg: "Email is required",
					},
					notEmpty: {
						msg: "Email is required",
					},
					isEmail: {
						msg: "Email must valid",
					},
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: "Password is required",
					},
					notEmpty: {
						msg: "Password is required",
					},
				},
			},
			role: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "admin",
			},
		},
		{
			sequelize,
			modelName: "User",
		}
	);

	User.beforeCreate(async (user) => {
		user.role = "admin";
		user.password = await hashPass(user.password);
	});

	return User;
};
