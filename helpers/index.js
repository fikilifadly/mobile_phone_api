const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

const hashPass = (password) => {
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);
	return hash;
};

const comparePassword = (plain, hashed) => bcrypt.compareSync(plain, hashed);

const signToken = (payload) => jwt.sign(payload, process.env.SECRET);

const verifyToken = (token) => jwt.verify(token, process.env.SECRET);

const isObjectEmpty = (objectName) => Object.keys(objectName).length === 0;

const storage = cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

module.exports = { hashPass, comparePassword, signToken, verifyToken, isObjectEmpty, storage };
