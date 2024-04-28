const app = require("../app");
const request = require("supertest");

const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const { signToken, verifyToken } = require("../helpers");

const products = require("../data/product.json").map((el) => {
	el.createdAt = new Date();
	el.updatedAt = new Date();
	return el;
});

const users = require("../data/user.json").map((el) => {
	el.createdAt = new Date();
	el.updatedAt = new Date();
	return el;
});

let superUser;
let admin1;
let admin2;

beforeAll(async () => {
	//seeding data
	await queryInterface.bulkInsert("Users", users, {});
	await queryInterface.bulkInsert("Products", products, {});

	//set token
	superUser = signToken({ id: 1, username: "superadmin", role: "superadmin" });
	admin1 = signToken({ id: 2, username: "admin", role: "admin" });
	admin2 = signToken({ id: 3, username: "admin2", role: "admin" });
});

afterAll(async () => {
	await queryInterface.bulkDelete("Users", null, {
		truncate: true,
		cascade: true,
		restartIdentity: true,
	});
	await queryInterface.bulkDelete("Products", null, {
		truncate: true,
		cascade: true,
		restartIdentity: true,
	});
});

describe("Products Create", () => {
	test("POST /products should reponse 200 with any registered user", async () => {
		const currToken = verifyToken(accessToken);
		const data = {
			name: "samsang",
			description: "test",
			price: 500,
			stock: 5,
			image: "test.jpeg",
		};

		const response = await request(app).post("/products").set("Authorization", `Bearer ${accessToken}`).send(data);

		expect(response.status).toBe(201);
		expect(response.body.message).toEqual("Product samsang successfully created");
	});

	test("POST /products should reponse 404 with null name, description imgUrl, invalid price and empty categoryId", async () => {
		const currToken = verifyToken(accessToken);
		const data = {
			name: "samsang",
			description: "test",
			price: 500,
			stock: 5,
			image: "test.jpeg",
		};

		const response = await request(app).post("/products").set("Authorization", `Bearer ${accessToken}`).send(data);

		expect(response.status).toBe(400);
		expect(response.body.message.length).toEqual(5);
		expect(response.body.message[0]).toEqual("Category Tidak Boleh Kosong");
		expect(response.body.message[1]).toEqual("Nama Cuisine Tidak Boleh Kosong");
		expect(response.body.message[2]).toEqual("Deskripsi Tidak Boleh Kosong");
		expect(response.body.message[3]).toEqual("Minimal Price 10.000");
		expect(response.body.message[4]).toEqual("Image Tidak Boleh Kosong");
	});

	// a.2
	test("POST /products should reponse 404 with null name, description imgUrl, price", async () => {
		const currToken = verifyToken(accessToken);
		const data = {
			name: "",
			description: "",
			price: "",
			imgUrl: "",
			categoryId: 1,
			authorId: currToken.id,
		};

		const response = await request(app).post("/products").set("Authorization", `Bearer ${accessToken}`).send(data);

		expect(response.status).toBe(400);
		expect(response.body.message.length).toEqual(4);
		expect(response.body.message[0]).toEqual("Nama Cuisine Tidak Boleh Kosong");
		expect(response.body.message[1]).toEqual("Deskripsi Tidak Boleh Kosong");
		expect(response.body.message[2]).toEqual("Price Tidak Boleh Kosong");
		expect(response.body.message[3]).toEqual("Image Tidak Boleh Kosong");
	});

	// b
	test("POST /products should response 401 without token", async () => {
		const currToken = verifyToken(accessToken);
		const data = {
			name: "new restoran",
			description: "restoran baru",
			price: 50000,
			imgUrl: "test.jpeg",
			categoryId: 1,
			authorId: currToken.id,
		};
		const response = await request(app).post("/products").send(data);

		expect(response.status).toBe(401);
		expect(response.body.message).toEqual("Error authentication");
	});

	// c
	test("POST /products should response 401 with invalid token", async () => {
		const currToken = verifyToken(dummyToken);
		const data = {
			name: "new restoran",
			description: "restoran baru",
			price: 50000,
			imgUrl: "test.jpeg",
			categoryId: 1,
			authorId: currToken.id,
		};
		const response = await request(app).post("/products").set("Authorization", `Bearer ${dummyToken}`).send(data);

		expect(response.status).toBe(401);
		expect(response.body.message).toEqual("Error authentication");
	});
});
