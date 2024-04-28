"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Product extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Product.belongsTo(models.User, { foreignKey: "UserId" });
		}

		static getProducts(name, role, id, include) {
			console.log(name, role, id, "===from model===");

			const option = {
				include,
				where: {},
				order: [["id", "DESC"]],
			};

			if (name) {
				option.where.name = {
					[Op.iLike]: `%${name}%`,
				};
			}

			if (role !== "superadmin") {
				option.where.UserId = {
					[Op.eq]: id,
				};
			}

			return this.findAll(option);
		}
	}
	Product.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: "Name is required",
					},
					notEmpty: {
						msg: "Name is required",
					},
				},
			},
			description: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: "Description is required",
					},
					notEmpty: {
						msg: "Description is required",
					},
				},
			},
			price: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: {
						msg: "Price is required",
					},
					notEmpty: {
						msg: "Price is required",
					},
				},
			},
			stock: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: {
						msg: "Stock is required",
					},
					notEmpty: {
						msg: "Stock is required",
					},
				},
			},
			image: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: "Image is required",
					},
					notEmpty: {
						msg: "Image is required",
					},
				},
			},
			UserId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "Product",
		}
	);
	return Product;
};
