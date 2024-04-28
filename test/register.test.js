const app = require("../app");
const request = require("supertest");

const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const { signToken } = require("../helpers");

const user = require("../data/user.json").map((el) => {
	el.createdAt = new Date();
	el.updatedAt = new Date();

	return el;
});

let accessToken;
let dummyToken;

beforeAll(async () => {
	//seeding data
	await queryInterface.bulkInsert("Users", user, {});

	//set token
	accessToken = signToken({ id: 1, username: "superadmin", role: "superadmin" });
	dummyToken = signToken({ id: 100 });
});

afterAll(async () => {
	await queryInterface.bulkDelete("Users", null, {
		truncate: true,
		cascade: true,
		restartIdentity: true,
	});
});

describe("2. CREATE User", () => {
	// a
	test("POST /user/register should reponse 201", async () => {
		const data = {
			username: "fiki",
			email: "fiki@gmail.com",
			password: "12345678",
		};
		const response = await request(app).post("/user/register").set("Authorization", `Bearer ${accessToken}`).send(data);

		expect(response.status).toBe(201);
		expect(response.body.message).toEqual("User fiki has been created");
	});

	// b
	test("POST /user/register should reponse 400 without email", async () => {
		const data = {
			email: "fiki@gmail.com",
			password: "12345678",
		};
		const response = await request(app).post("/user/register").set("Authorization", `Bearer ${accessToken}`).send(data);

		expect(response.status).toBe(400);
		expect(response.body.message).toEqual("Username is required");
	});

	// c
	test("POST /user/register should reponse 400 without password", async () => {
		const data = {
			username: "fiki",
			email: "fiki@gmail.com",
		};
		const response = await request(app).post("/user/register").set("Authorization", `Bearer ${accessToken}`).send(data);

		expect(response.status).toBe(400);
		expect(response.body.message).toEqual("Password is required");
	});

	// f
	test("POST /user/register should reponse 400 with registered email", async () => {
		const data = {
			username: "fiki",
			email: "fiki@gmail.com",
			password: "12345678",
		};
		const response = await request(app).post("/user/register").set("Authorization", `Bearer ${accessToken}`).send(data);

		expect(response.status).toBe(400);
		expect(response.body.message).toEqual("Email already registered");
	});

	// g
	test("POST /user/register should reponse 400 with invalid email format", async () => {
		const data = {
			username: "fiki",
			email: "fiki",
			password: "12345678",
		};
		const response = await request(app).post("/user/register").set("Authorization", `Bearer ${accessToken}`).send(data);

		expect(response.status).toBe(400);
		expect(response.body.message).toEqual("Email must valid");
	});

	// h
	test("POST /user/register should response 401 without token", async () => {
		const data = {
			username: "fiki",
			email: "fiki@gmail.com",
			password: "12345678",
		};
		const response = await request(app).post("/user/register").send(data);

		expect(response.status).toBe(401);
		expect(response.body.message).toEqual("Invalid token");
	});
});
