import { clearDatabaseStart, clearDatabaseEnd } from "../../tests/db";
import { faker } from "@faker-js/faker";
import supertest from "supertest";
import { createToken } from "../../config/authentication/jwt";
import * as dal from "../auth/auth.dal";
import Crypto from "crypto";
import { initServer } from "../../..";

describe("Airports testing", () => {
  let adminToken = null;
  let userToken = null;
  let createdUser = null;
	let createdAirport = null;
	const name = "munich";
	const adress = {
		street: "hans",
		zipcode: 99999,
		city: "munich",
		country: "germany"
	}

  beforeAll(async () => {
		await initServer();
    await clearDatabaseStart().then(() => console.log("cleared"));
		console.log("Airports")
    createdUser = await dal.createUser({
      content: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password(),
        confirmationLevel: 1,
        confirmationToken: Crypto.randomBytes(32).toString("hex"),
        twoFactorAuth: { active: true },
        isAdmin: false,
      },
    });
    const createdAdmin = await dal.createUser({
      content: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password(),
        confirmationLevel: 1,
        confirmationToken: Crypto.randomBytes(32).toString("hex"),
        twoFactorAuth: { active: true },
        isAdmin: true,
      },
    });

    userToken = `Bearer ${createToken(createdUser)}`;
    adminToken = `Bearer ${createToken(createdAdmin)}`;
  });

  /**
   * Endpoint: "POST /airports"
   */

  it('Test "POST /airports" (Fail test case: Not authorized)', async () => {
    const body = {
      name,
      adress
    };
    const response = await supertest("http://localhost:8000")
      .post("/api/v1/airports")
      .set("authorization", userToken)
      .send(body);

    expect(response.status).toEqual(403);
  });

  it('Test "POST /airports" (Success test case)', async () => {
    const body = {
      name,
      adress,
    };
    const response = await supertest("http://localhost:8000")
      .post("/api/v1/airports")
      .set("authorization", adminToken)
      .send(body);

    expect(response.status).toEqual(201);

    createdAirport = response.body;
  });

  it('Test "POST /airports" (Fail test case: Duplicate names)', async () => {
    const body = {
      name,
      adress,
    };
    const response = await supertest("http://localhost:8000")
      .post("/api/v1/airports")
      .set("authorization", adminToken)
      .send(body);

    expect(response.status).toEqual(422);
  });

  /**
   * Endpoint: "GET /airports"
   */

  it('Test "GET /airports" (Success test case)', async () => {
    const response = await supertest("http://localhost:8000")
      .get(`/api/v1/airports/all`)
      .set("authorization", userToken);

    expect(response.status).toEqual(200);
  });

  /**
   * Endpoint: "GET /airports/:id"
   */

  it('Test "GET /airports/:id" (Fail test case: Not Found)', async () => {
    const response = await supertest("http://localhost:8000")
      .get(`/api/v1/airports/${createdUser._id}`)
      .set("authorization", userToken);

    expect(response.status).toEqual(404);
  });

  it('Test "GET /airports/:id" (Success test case)', async () => {
    const response = await supertest("http://localhost:8000")
      .get(`/api/v1/airports/${createdAirport._id}`)
      .set("authorization", userToken);

    expect(response.status).toEqual(200);
  });

  /**
   * Endpoint: "PATCH /airports/:id"
   */

  it('Test "PATCH /airports/:id" (Fail test case: Not Found)', async () => {
    const response = await supertest("http://localhost:8000")
      .patch(`/api/v1/airports/${createdUser._id}`)
      .set("authorization", adminToken);

    expect(response.status).toEqual(400);
  });

  it('Test "PATCH /airports/:id" (Success test case)', async () => {
    const newFirstName = faker.name.firstName();
    const response = await supertest("http://localhost:8000")
      .patch(`/api/v1/airports/${createdAirport._id}`)
      .set("authorization", adminToken)
      .send({ name: newFirstName, adress: adress });

    expect(response.status).toEqual(204);
  });

  /**
   * Endpoint: "DELETE /airports/:id"
   */

  it('Test "DELETE /airports/:id" (Success test case)', async () => {
    const response = await supertest("http://localhost:8000")
      .delete(`/api/v1/airports/${createdAirport._id}`)
      .set("authorization", adminToken);

    expect(response.status).toEqual(204);
  });

  it('Test "DELETE /airports/:id" (Fail test case: Not Found)', async () => {
    const response = await supertest("http://localhost:8000")
      .delete(`/api/v1/airports/${createdUser._id}`)
      .set("authorization", adminToken);

    expect(response.status).toEqual(404);
  });
	

  afterAll(async () => {
    await clearDatabaseEnd().then(() => console.log("cleared"));
  });
});
