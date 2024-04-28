const { verifyToken } = require("../helpers");
const { User } = require("../models");

async function authentication(req, res, next) {
	try {
		const { authorization } = req.headers;

		if (!authorization) throw { name: "Invalid token", status: 401 };

		const [bearer, token] = authorization.split(" ");

		if (bearer !== "Bearer" || !token) throw { name: "Invalid token", status: 401 };

		const { id } = verifyToken(token);
		const user = await User.findOne({
			where: {
				id,
			},
		});
		if (!user) throw { name: "Invalid token", status: 401 };

		req.user = {
			id,
		};

		next();
	} catch (error) {
		console.log("error auth: ", error);
		next(error);
	}
}

module.exports = authentication;
