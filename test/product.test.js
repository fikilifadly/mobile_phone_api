const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const { signToken, verifyToken, convertImageToBase64 } = require("../helpers");

process.env.SECRET = "yourSecretKey";

const products = require("../data/products.json").map((el) => {
	el.createdAt = new Date();
	el.updatedAt = new Date();
	return el;
});

const users = require("../data/user.json").map((el) => {
	el.createdAt = new Date();
	el.updatedAt = new Date();
	return el;
});

const access_token = signToken({ id: 1, username: "superadmin", role: "superadmin" });
const access_token_admin = signToken({ id: 2, username: "admin", role: "admin" });
const access_token_admin2 = signToken({ id: 3, username: "admin2", role: "admin" });
const dummy_token = signToken({ id: 10, username: "dummy", role: "superadmin" });

const image64 =
	"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";
const imageb64 = `data:image/jpeg;base64,${image64}`;

console.log(imageb64);

beforeAll(async () => {
	//seeding data
	await queryInterface.bulkInsert("Users", users, {});
	await queryInterface.bulkInsert("Products", products, {});
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
	test("POST /product should reponse 200 with any registered user", async () => {
		const data = {
			name: "samsang",
			description: "test",
			price: 500,
			stock: 5,
			image: imageb64,
		};

		const response = await request(app).post("/product").set("Authorization", `Bearer ${access_token}`).send(data);

		expect(response.status).toBe(201);
		expect(response.body.message).toEqual("Product samsang successfully created");
	});

	test("POST /product should reponse 404 with null/empyt name", async () => {
		const data = {
			name: "",
			description: "test",
			price: 500,
			stock: 5,
			image: imageb64,
		};

		const response = await request(app).post("/product").set("Authorization", `Bearer ${access_token}`).send(data);

		expect(response.status).toBe(400);
		expect(response.body.message).toEqual("Name is required");
	});

	test("POST /product should reponse 404 with null/empyt description", async () => {
		const data = {
			name: "infinix`",
			description: "",
			price: 500,
			stock: 5,
			image: imageb64,
		};

		const response = await request(app).post("/product").set("Authorization", `Bearer ${access_token}`).send(data);

		expect(response.status).toBe(400);
		expect(response.body.message).toEqual("Description is required");
	});

	test("POST /product should reponse 404 with null/empyt price", async () => {
		const data = {
			name: "infinix`",
			description: "test",
			stock: 5,
			image: imageb64,
		};

		const response = await request(app).post("/product").set("Authorization", `Bearer ${access_token}`).send(data);

		expect(response.status).toBe(400);
		expect(response.body.message).toEqual("Price is required");
	});

	test("POST /product should reponse 404 with null/empyt stock", async () => {
		const data = {
			name: "infinix`",
			description: "test",
			price: 500,
			image: imageb64,
		};

		const response = await request(app).post("/product").set("Authorization", `Bearer ${access_token}`).send(data);

		expect(response.status).toBe(400);
		expect(response.body.message).toEqual("Stock is required");
	});

	test("POST /product should reponse 404 with null/empyt image", async () => {
		const data = {
			name: "infinix`",
			description: "test",
			price: 500,
			stock: 5,
		};

		const response = await request(app).post("/product").set("Authorization", `Bearer ${access_token}`).send(data);

		expect(response.status).toBe(400);
		expect(response.body.message).toEqual("Image is required");
	});

	test("POST /product should response 401 without token", async () => {
		const data = {
			name: "samsang",
			description: "test",
			price: 500,
			stock: 5,
			image: imageb64,
		};
		const response = await request(app).post("/product").send(data);

		expect(response.status).toBe(401);
		expect(response.body.message).toEqual("Invalid token");
	});

	test("POST /product should response 401 with invalid token", async () => {
		const data = {
			name: "samsang",
			description: "test",
			price: 500,
			stock: 5,
			image: imageb64,
		};
		const response = await request(app).post("/product").set("Authorization", `Bearer ${dummy_token}`).send(data);

		expect(response.status).toBe(401);
		expect(response.body.message).toEqual("Invalid token");
	});
});

describe("Products GET", () => {
	test("GET /product should reponse 200 with any registered user", async () => {
		const response = await request(app).get("/product").set("Authorization", `Bearer ${access_token}`);

		expect(response.status).toBe(200);
		expect(response.body.length).toEqual(6);
	});

	test("GET /product should response 401 without token", async () => {
		const response = await request(app).get("/product");

		expect(response.status).toBe(401);
		expect(response.body.message).toEqual("Invalid token");
	});

	test("GET /product should response 401 with invalid token", async () => {
		const response = await request(app).get("/product").set("Authorization", `Bearer ${dummy_token}`);

		expect(response.status).toBe(401);
		expect(response.body.message).toEqual("Invalid token");
	});
});

describe("Products GET BY ID", () => {
	test("GET /product/1 should reponse 200 with any registered user", async () => {
		const response = await request(app).get("/product/1").set("Authorization", `Bearer ${access_token}`);

		expect(response.status).toBe(200);
	});

	test("GET /product/100 should reponse 404", async () => {
		const response = await request(app).get("/product/100").set("Authorization", `Bearer ${access_token}`);

		expect(response.status).toBe(404);
		expect(response.body.message).toEqual("Product not found");
	});

	test("GET /product should response 401 without token", async () => {
		const response = await request(app).get("/product/1");

		expect(response.status).toBe(401);
		expect(response.body.message).toEqual("Invalid token");
	});

	test("GET /product should response 401 with invalid token", async () => {
		const response = await request(app).get("/product/1").set("Authorization", `Bearer ${dummy_token}`);

		expect(response.status).toBe(401);
		expect(response.body.message).toEqual("Invalid token");
	});
});

describe("Products UPDATE BY ID", () => {
	test("PATCH /product/1 should reponse 200 with same userid product", async () => {
		const data = {
			name: "samsang",
		};

		const response = await request(app).patch("/product/1").set("Authorization", `Bearer ${access_token_admin2}`).send(data);

		expect(response.status).toBe(200);
		expect(response.body.message).toEqual("Product samsang successfully updated");
	});

	test("PATCH /product/1 should reponse 403 with diffrent userid product", async () => {
		const data = {
			name: "samsang",
		};

		const response = await request(app).patch("/product/1").set("Authorization", `Bearer ${access_token_admin}`);

		expect(response.status).toBe(403);
		expect(response.body.message).toEqual("You dont have permission");
	});

	test("PATCH /product/100 should reponse 404", async () => {
		const response = await request(app).patch("/product/100").set("Authorization", `Bearer ${access_token}`);

		expect(response.status).toBe(404);
		expect(response.body.message).toEqual("Product not found");
	});

	test("PATCH /product/1 should reponse 400 without data", async () => {
		const response = await request(app).patch("/product/1").set("Authorization", `Bearer ${access_token}`);

		expect(response.status).toBe(400);
		expect(response.body.message).toEqual("Theres nothing to update");
	});

	test("PATCH /product should response 401 without token", async () => {
		const response = await request(app).patch("/product/1");

		expect(response.status).toBe(401);
		expect(response.body.message).toEqual("Invalid token");
	});

	test("PATCH /product should response 401 with invalid token", async () => {
		const response = await request(app).patch("/product/1").set("Authorization", `Bearer ${dummy_token}`);

		expect(response.status).toBe(401);
		expect(response.body.message).toEqual("Invalid token");
	});
});

describe.only("Products DELETE BY ID", () => {
	test("DELETE /product/1 should reponse 200 with same userid product", async () => {
		const response = await request(app).delete("/product/1").set("Authorization", `Bearer ${access_token_admin2}`);

		expect(response.status).toBe(200);
		expect(response.body.message).toEqual("Product Samsung Galaxy S23 Ultra successfully deleted");
	});

	test("DELETE /product/2 should reponse 403 with diffrent userid product", async () => {
		const response = await request(app).delete("/product/2").set("Authorization", `Bearer ${access_token_admin}`);

		expect(response.status).toBe(403);
		expect(response.body.message).toEqual("You dont have permission");
	});

	test("DELETE /product/100 should reponse 404", async () => {
		const response = await request(app).delete("/product/100").set("Authorization", `Bearer ${access_token}`);

		expect(response.status).toBe(404);
		expect(response.body.message).toEqual("Product not found");
	});

	test("DELETE /product should response 401 without token", async () => {
		const response = await request(app).delete("/product/1");

		expect(response.status).toBe(401);
		expect(response.body.message).toEqual("Invalid token");
	});

	test("DELETE /product should response 401 with invalid token", async () => {
		const response = await request(app).delete("/product/1").set("Authorization", `Bearer ${dummy_token}`);

		expect(response.status).toBe(401);
		expect(response.body.message).toEqual("Invalid token");
	});
});
