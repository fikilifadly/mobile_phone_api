const { User } = require("../models");

module.exports = class UserController {
	static async register(req, res, next) {
		try {
			if (!req.body) {
				throw { name: "Username, Email and Password is required", status: 400 };
			}

			const { username, email, password } = req.body;

			const user = await User.findOne({
				where: {
					email,
				},
			});

			if (user) throw { name: "Email already registered", status: 400 };

			await User.create({ username, email, password });

			res.status(201).json({ message: `User ${user} has been created` });
		} catch (error) {
			next(error);
		}
	}

	static async login(req, res, next) {
		try {
			try {
				if (!req.body) {
					throw { name: "Email and Password is required", status: 400 };
				}

				const { email, password } = req.body;

				if (!email) throw { name: "Email is required", status: 400 };
				if (!password) throw { name: "Password is required", status: 400 };

				const data = await User.findOne({
					where: {
						email,
					},
				});

				if (!data) throw { name: "Invalid email/password", status: 401 };

				const matchPass = comparePass(password, data.password);
				if (!matchPass) throw { name: "Invalid email/password", status: 401 };

				const access_token = signToken({ id: data.id });

				res.status(200).json({ access_token });
			} catch (error) {
				next(error);
			}
		} catch (error) {}
	}
};
