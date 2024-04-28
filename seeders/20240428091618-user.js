"use strict";

const { hashPass } = require("../helpers");
const users = require("../data/user").map((user) => {
	user.password = hashPass(user.password);
	user.createdAt = user.updatedAt = new Date();

	return user;
});

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert("Users", users, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("Users", null, {});
	},
};
