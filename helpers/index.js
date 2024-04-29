const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const hashPass = (password) => {
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);
	return hash;
};

const comparePassword = (plain, hashed) => bcrypt.compareSync(plain, hashed);

const signToken = (payload) => jwt.sign(payload, process.env.SECRET);

const verifyToken = (token) => {
	return jwt.verify(token, process.env.SECRET);
};

const isObjectEmpty = (objectName) => Object.keys(objectName).length === 0;

const convertImageToBase64 = (imageFile) => {
	const reader = new FileReader();
	reader.readAsDataURL(imageFile);
	return new Promise((resolve) => {
		reader.onload = (event) => resolve(event.target.result);
	});
};

module.exports = { hashPass, comparePassword, signToken, verifyToken, isObjectEmpty, convertImageToBase64 };
