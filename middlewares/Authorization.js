const { User, Product } = require("../models");

const ProductAuthorization = async (req, res, next) => {
	try {
		const { role, id: userId } = req.user;

		const product = await Product.findOne({
			where: {
				id: req.params.id,
			},
		});

		if (userId !== product.UserId && role !== "superadmin") throw { name: "Your dont have permission" };

		next();
	} catch (error) {
		next(error);
	}
};

const suAuthorization = async (req, res, next) => {
	try {
		const { role } = req.user;
		if (role !== "superadmin") throw { name: "Your dont have permission" };

		next();
	} catch (error) {
		next(error);
	}
};

module.exports = { ProductAuthorization, suAuthorization };
