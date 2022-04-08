import { clearDatabaseStart, clearDatabaseEnd } from "../../tests/db";
import { faker } from "@faker-js/faker";
import supertest from "supertest";
import { createToken } from "../../config/authentication/jwt";
import * as dal from "../auth/auth.dal";
import Crypto from "crypto";
import { initServer } from "../../..";

describe("Flights testing", () => {
  let adminToken = null;
  let userToken = null;
  let createdUser = null;
	let createdAirplane = null;
	const name = "Antonov";
	const capacity = 80 ;

  beforeAll(async () => {
		await initServer();
    await clearDatabaseStart().then(() => console.log("cleared"));
		console.log("Airplanes");
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
   * Endpoint: "POST /airplanes"
   */

  it('Test "POST /airplanes" (Fail test case: Not authorized)', async () => {
    const body = {
      name,
      capacity
    };
    const response = await supertest("http://localhost:8000")
      .post("/api/v1/airplanes")
      .set("authorization", userToken)
      .send(body);

    expect(response.status).toEqual(403);
  });

  it('Test "POST /airplanes" (Success test case)', async () => {
    const body = {
      name,
      capacity,
    };
    const response = await supertest("http://localhost:8000")
      .post("/api/v1/airplanes")
      .set("authorization", adminToken)
      .send(body);

    expect(response.status).toEqual(201);

    createdAirplane = response.body;
  });

  it('Test "POST /airplanes" (Fail test case: Duplicate names)', async () => {
    const body = {
      name,
      capacity,
    };
    const response = await supertest("http://localhost:8000")
      .post("/api/v1/airplanes")
      .set("authorization", adminToken)
      .send(body);

    expect(response.status).toEqual(422);
  });

  /**
   * Endpoint: "GET /airplanes"
   */

  it('Test "GET /airplanes" (Success test case)', async () => {
    const response = await supertest("http://localhost:8000")
      .get(`/api/v1/airplanes/all`)
      .set("authorization", userToken);

    expect(response.status).toEqual(200);
  });

  /**
   * Endpoint: "GET /airplanes/:id"
   */

  it('Test "GET /airplanes/:id" (Fail test case: Not Found)', async () => {
    const response = await supertest("http://localhost:8000")
      .get(`/api/v1/airplanes/${createdUser._id}`)
      .set("authorization", userToken);

    expect(response.status).toEqual(404);
  });

  it('Test "GET /airplanes/:id" (Success test case)', async () => {
    const response = await supertest("http://localhost:8000")
      .get(`/api/v1/airplanes/${createdAirplane._id}`)
      .set("authorization", userToken);

    expect(response.status).toEqual(200);
  });

  /**
   * Endpoint: "PATCH /airplanes/:id"
   */

  it('Test "PATCH /airplanes/:id" (Fail test case: Not Found)', async () => {
    const response = await supertest("http://localhost:8000")
      .patch(`/api/v1/airplanes/${createdUser._id}`)
      .set("authorization", adminToken);

    expect(response.status).toEqual(400);
  });

  it('Test "PATCH /airplanes/:id" (Success test case)', async () => {
    const newFirstName = faker.name.firstName();
    const response = await supertest("http://localhost:8000")
      .patch(`/api/v1/airplanes/${createdAirplane._id}`)
      .set("authorization", adminToken)
      .send({ name: newFirstName, capacity: capacity });

    expect(response.status).toEqual(204);
  });

  /**
   * Endpoint: "DELETE /airplanes/:id"
   */

  it('Test "DELETE /airplanes/:id" (Success test case)', async () => {
    const response = await supertest("http://localhost:8000")
      .delete(`/api/v1/airplanes/${createdAirplane._id}`)
      .set("authorization", adminToken);

    expect(response.status).toEqual(204);
  });

  it('Test "DELETE /airplanes/:id" (Fail test case: Not Found)', async () => {
    const response = await supertest("http://localhost:8000")
      .delete(`/api/v1/airplanes/${createdUser._id}`)
      .set("authorization", adminToken);

    expect(response.status).toEqual(404);
  });
	

  afterAll(async () => {
    await clearDatabaseEnd().then(() => console.log("cleared"));
  });
});
