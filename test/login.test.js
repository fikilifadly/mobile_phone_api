const app = require("../app");
const request = require("supertest");

const { sequelize } = require("../models");
const { queryInterface } = sequelize;

const { User } = require("../models");

beforeAll(async () => {
	//seeding data
	User.create({
		username: "test",
		email: "admin@gmail.com",
		password: "12345678",
		role: "admin",
	});
});

afterAll(async () => {
	await queryInterface.bulkDelete("Users", null, {
		truncate: true,
		cascade: true,
		restartIdentity: true,
	});
});

describe("Login", () => {
	// a
	test("POST /user/login should reponse 200", async () => {
		const data = {
			email: "admin@gmail.com",
			password: "12345678",
		};
		const response = await request(app).post("/user/login").send(data);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("access_token", expect.any(String));
	});

	// b
	test("POST /user/login should reponse 400 without email", async () => {
		const data = {
			password: "12345678",
		};
		const response = await request(app).post("/user/login").send(data);

		expect(response.status).toBe(400);
		expect(response.body.message).toEqual("Email is required");
	});

	// c
	test("POST /user/login should reponse 400 without password", async () => {
		const data = {
			email: "admin@gmail.com",
		};
		const response = await request(app).post("/user/login").send(data);

		expect(response.status).toBe(400);
		expect(response.body.message).toEqual("Password is required");
	});

	// d
	test("POST /user/login should reponse 401 with invalid email", async () => {
		const data = {
			email: "admin12321@gmail.com",
			password: "12345678",
		};
		const response = await request(app).post("/user/login").send(data);

		expect(response.status).toBe(401);
		expect(response.body.message).toEqual("Invalid email/password");
	});
});
