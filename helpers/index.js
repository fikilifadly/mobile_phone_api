const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hashPass = (password) => {
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);
	return hash;
};

const comparePass = (plainPass, hashedPass) => {
	return bcrypt.compareSync(plainPass, hashedPass);
};

const signToken = (payload) => {
	return jwt.sign(payload, process.env.SECRET);
};

const verifyToken = (token) => {
	return jwt.verify(token, process.env.SECRET);
};

module.exports = { hashPass, comparePass, signToken, verifyToken };
