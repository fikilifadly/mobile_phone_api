const { Product, User } = require("../models");
const { isObjectEmpty } = require("../helpers");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

module.exports = class ProductController {
	static async getAllProducts(req, res, next) {
		try {
			const { name } = req.query;
			const { role, id } = req.user;

			const include = [
				{
					model: User,
					attributes: ["username"],
				},
			];

			const products = await Product.getProducts(name, role, id, include);

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

				include: {
					model: User,
					attributes: ["username"],
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
			const { id } = req.user;

			if (!image) throw { name: "Image is required", status: 400 };

			const convertedImage = await cloudinary.uploader.upload(image, { folder: "10xers" });

			const product = await Product.create({
				name,
				description,
				price,
				stock,
				image: convertedImage.url,
				UserId: id,
			});
			res.status(201).json({ message: `Product ${product.name} successfully created` });
		} catch (error) {
			next(error);
		}
	}

	static async updateProduct(req, res, next) {
		try {
			const { UserId, image } = req.body;

			const { id } = req.params;

			const product = await Product.findOne({
				where: {
					id,
				},
			});

			if (!product) throw { name: "Product not found", status: 404 };
			if (isObjectEmpty(req.body)) throw { name: "Theres nothing to update", status: 400 };

			if (UserId) throw { name: "Forbidden access", status: 403 };

			const removeSame = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => key in product && value !== undefined && value !== null && value !== ""));

			if (image) {
				const { url } = await cloudinary.uploader.upload(image, { folder: "10xers" });

				removeSame.image = url;
			}

			console.log(removeSame, "=====");

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
