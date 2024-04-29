const { User, Product } = require("../models");

const ProductAuthorization = async (req, res, next) => {
	try {
		const { role, id: userId } = req.user;

		console.log(role, userId);

		const product = await Product.findOne({
			where: {
				id: req.params.id,
			},
		});

		if (product) {
			if (userId != product.UserId && role !== "superadmin") throw { name: "You dont have permission", status: 403 };
		}

		next();
	} catch (error) {
		next(error);
	}
};

const suAuthorization = async (req, res, next) => {
	try {
		const { role } = req.user;
		if (role !== "superadmin") throw { name: "Your dont have permission", status: 403 };

		next();
	} catch (error) {
		next(error);
	}
};

module.exports = { ProductAuthorization, suAuthorization };
