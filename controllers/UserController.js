const { signToken, comparePassword, hashPass } = require("../helpers");
const { User } = require("../models");

module.exports = class UserController {
	static async register(req, res, next) {
		try {
			const { username, email, password } = req.body;
			if (!username) throw { name: "Username is required", status: 400 };
			if (!email) throw { name: "Email is required", status: 400 };
			if (!password) throw { name: "Password is required", status: 400 };

			const user = await User.findOne({
				where: {
					email,
				},
			});

			if (user) throw { name: "Email already registered", status: 400 };

			const data = {
				username,
				email,
				password,
			};

			await User.create(data);

			res.status(201).json({ message: `User ${username} has been created` });
		} catch (error) {
			next(error);
		}
	}

	static async login(req, res, next) {
		try {
			const { email, password } = req.body;

			if (!email) throw { name: "Email is required", status: 400 };
			if (!password) throw { name: "Password is required", status: 400 };

			const user = await User.findOne({
				where: {
					email,
				},
				attributes: ["id", "username", "email", "password", "role"],
			});

			if (!user) throw { name: "Invalid email/password", status: 401 };

			const matchPass = comparePassword(password, user.password);
			if (!matchPass) throw { name: "Invalid email/password", status: 401 };
			console.log(user, "======");

			const access_token = signToken({ id: user.id, name: user.username, role: user.role });

			res.status(200).json({ access_token });
		} catch (error) {
			next(error);
		}
	}
};
