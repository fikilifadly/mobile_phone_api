const { Op } = require("sequelize");
const { Product } = require("../models");

module.exports = class ProductController {
	static async getAllProducts(req, res, next) {
		try {
			const { name } = req.query;
			if (name) {
				const products = await Product.findAll({
					where: {
						name: {
							[Op.iLike]: `%${name}%`,
						},
					},
				});
				return res.status(200).json(products);
			}
			const products = await Product.findAll();
			res.status(200).json(products);
		} catch (error) {
			next(error);
		}
	}

	static async getProductById(req, res, next) {
		try {
			const { id } = req.params;
			const product = await Product.findOne({
				where: {
					id,
				},
			});

			if (!product) throw { name: "Product not found", status: 404 };

			res.status(200).json(product);
		} catch (error) {
			next(error);
		}
	}

	static async createProduct(req, res, next) {
		try {
			const { name, description, price, stock, image } = req.body;

			const product = await Product.create({
				name,
				description,
				price,
				stock,
				image,
			});
			res.status(201).json(product);
		} catch (error) {
			next(error);
		}
	}

	static async updateProduct(req, res, next) {
		try {
			const { id } = req.params;
			const { name, description, price, stock, image } = req.body;

			const product = await Product.findOne({
				where: {
					id,
				},
			});

			if (!product) throw { name: "Product not found", status: 404 };

			const removeSame = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => key in product && value !== undefined && value !== null && value !== ""));

			delete removeSame.UserId;

			await product.update(removeSame);
			await product.save();

			res.status(200).json({ message: `Product ${product.name} successfully updated` });
		} catch (error) {
			next(error);
		}
	}

	static async deleteProduct(req, res, next) {
		try {
			const { id } = req.params;
			const product = await Product.findOne({
				where: {
					id,
				},
			});
			if (!product) throw { name: "Product not found", status: 404 };

			await Product.destroy({
				where: {
					id,
				},
			});

			res.status(200).json({ message: `Product ${product.name} successfully deleted` });
		} catch (error) {
			next(error);
		}
	}
};
