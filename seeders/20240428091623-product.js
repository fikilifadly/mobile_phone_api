"use strict";

const products = require("../data/products").map((el) => {
	el.createdAt = el.updatedAt = new Date();

	return el;
});

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert("Products", products, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("Products", null, {});
	},
};
