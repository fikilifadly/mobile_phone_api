const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hashPass = (password) => {
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);
	return hash;
};

const comparePassword = (plain, hashed) => bcrypt.compareSync(plain, hashed);

const signToken = (payload) => jwt.sign(payload, process.env.SECRET);

const verifyToken = (token) => jwt.verify(token, process.env.SECRET);

module.exports = { hashPass, comparePassword, signToken, verifyToken };
