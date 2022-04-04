import { clearDatabaseStart, clearDatabaseEnd } from "../../tests/db";
import { faker } from "@faker-js/faker";
import supertest from "supertest";
import { stub } from "sinon";
import { initServer } from "../../..";
import errors from "../../constants/errors";
import mailService from "../../config/mail";
import { createToken } from "../../config/authentication/jwt";
import * as dal from "./auth.dal";
import Bcrypt from "bcryptjs";
import Crypto from "crypto";
import { generateToken } from "../../config/authentication/two_factor_auth";

describe("Authentication testing", () => {
  let sendEmailStub = null;
  let userToken = null;
  let confirmationToken = null;
  let twoStepAuthSecretKey = null;
	let adminToken = null;

  beforeAll(async () => {
    await initServer();
    sendEmailStub = stub(mailService, "sendEmail").resolves();
    await clearDatabaseStart().then(() => console.log("cleared"));
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
    adminToken = `Bearer ${createToken(createdAdmin)}`;
  });

  const email = faker.internet.email();
  const password = "Ran@0m?pass";

  it("First user", async () => {
    const body = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email,
      password,
      redirectUrl: faker.internet.url(),
    };
    const response = await supertest("http://localhost:8000")
      .post("/api/v1/auth/register")
      .send(body);

    expect(response.status).toEqual(204);
  });

  it("Duplicate Emails", async () => {
    const body = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email,
      password,
      redirectUrl: faker.internet.url(),
    };
    const response = await supertest("http://localhost:8000")
      .post("/api/v1/auth/register")
      .send(body);

    expect(response.status).toEqual(422);
    expect(response.body.details).toEqual(errors.DUPLICATE_EMAILS);
  });

  it("Resend confirmation Email: Fail", async () => {
    const body = {
      email: "not@found.com",
      redirectUrl: faker.internet.url(),
    };
    const response = await supertest("http://localhost:8000")
      .post(`/api/v1/auth/resend-confirmation-email`)
      .send(body);

    expect(response.status).toEqual(404);
    expect(response.body.details).toEqual(
      errors.USER_NOT_FOUND_OR_ACCOUNT_CONFIRMED
    );
  });

  it("Resend confirmation Email: Success", async () => {
    const body = {
      email: email,
      redirectUrl: faker.internet.url(),
    };
    const response = await supertest("http://localhost:8000")
      .post(`/api/v1/auth/resend-confirmation-email`)
      .send(body);

    expect(response.status).toEqual(204);
  });

  it("Login: Account not confirmed", async () => {
    const body = {
      email,
      password,
    };
    const response = await supertest("http://localhost:8000")
      .post("/api/v1/auth/login")
      .send(body);

    expect(response.status).toEqual(401);
  });

  it("Confirmation: Success", async () => {
    const user = await dal.findUser({ query: { email: email.toLowerCase() } });
    confirmationToken = user.confirmationToken;

    const response = await supertest("http://localhost:8000").put(
      `/api/v1/auth/confirmation?token=${confirmationToken}`
    );

    expect(response.status).toEqual(204);
  });

  it("Confirmation: Fail", async () => {
    const response = await supertest("http://localhost:8000").put(
      `/api/v1/auth/confirmation?token=${confirmationToken}`
    );

    expect(response.status).toEqual(404);
    expect(response.body.details).toEqual(
      errors.USER_NOT_FOUND_OR_ACCOUNT_CONFIRMED
    );
  });

  it("Login: Email not found", async () => {
    const body = {
      email: faker.internet.email(),
      password,
    };
    const response = await supertest("http://localhost:8000")
      .post("/api/v1/auth/login")
      .send(body);

    expect(response.status).toEqual(401);
    expect(response.body.details).toEqual(errors.USER_NOT_FOUND);
  });

  it("Login: Invalid password", async () => {
    const body = {
      email,
      password: "Invalid",
    };
    const response = await supertest("http://localhost:8000")
      .post("/api/v1/auth/login")
      .send(body);

    expect(response.status).toEqual(401);
    expect(response.body.details).toEqual(errors.INVALID_PASSWORD);
  });

  it("Login: Success", async () => {
    const body = {
      email,
      password,
    };
    const response = await supertest("http://localhost:8000")
      .post("/api/v1/auth/login")
      .send(body);

    const token = createToken(response.body);

    expect(response.status).toEqual(200);
    expect(response.body.token).toEqual(token);

    userToken = `Bearer ${response.body.token}`;
  });

  it("Request password: User not found", async () => {
    const body = {
      email: "not.found@example.com",
      redirectUrl: faker.internet.url(),
    };
    const response = await supertest("http://localhost:8000")
      .post(`/api/v1/auth/request-new-password`)
      .send(body);

    expect(response.status).toEqual(404);
    expect(response.body.details).toEqual(errors.USER_NOT_FOUND);
  });

  it("Request password: Success", async () => {
    const body = {
      email,
      redirectUrl: faker.internet.url(),
    };
    const response = await supertest("http://localhost:8000")
      .post(`/api/v1/auth/request-new-password`)
      .send(body);

    expect(response.status).toEqual(204);
  });

  it("Reset password: User not found", async () => {
    const body = {
      token: Crypto.randomBytes(32).toString("hex"),
      password: "Ran@0m?pass2",
    };
    const response = await supertest("http://localhost:8000")
      .put(`/api/v1/auth/password`)
      .send(body);

    expect(response.status).toEqual(404);
    expect(response.body.details).toEqual(errors.USER_NOT_FOUND);
  });

  it("Reset password: Success test case", async () => {
    const user = await dal.findUser({ query: { email: email.toLowerCase() } });
    const body = {
      token: user.confirmationToken,
      password: "Ran@0m?pass2",
    };
    const response = await supertest("http://localhost:8000")
      .put(`/api/v1/auth/password`)
      .send(body);

    expect(response.status).toEqual(204);

    const updatedUser = await dal.findUser({
      query: { email: email.toLowerCase() },
    });
    const passwordsMatch = Bcrypt.compareSync(
      body.password,
      updatedUser.password
    );

    expect(passwordsMatch).toEqual(true);
  });

  it("Get all users: Unauthorised (admin only)", async () => {
    const response = await supertest("http://localhost:8000")
      .get("/api/v1/users")
      .set("authorization", userToken);

    expect(response.status).toEqual(403);
  });

  it("Get all users: Success", async () => {
    const response = await supertest("http://localhost:8000")
      .get("/api/v1/users")
      .set("authorization", adminToken);

    expect(response.status).toEqual(200);
  });

  it("Get my profile: success", async () => {
    const response = await supertest("http://localhost:8000")
      .get("/api/v1/users/profile")
      .set("authorization", userToken);

    expect(response.status).toEqual(200);
  });

  it("Update my profile: success", async () => {
    const response = await supertest("http://localhost:8000")
      .patch("/api/v1/users/profile")
      .set("authorization", userToken)
      .send({ firstName: "newFirstName", lastName: "newLastName" });

    expect(response.status).toEqual(204);
  });

  it("two-factor-auth/initialization: Success", async () => {
    const response = await supertest("http://localhost:8000")
      .put(`/api/v1/auth/two-factor-auth/initialization`)
      .set("authorization", userToken);

    expect(response.status).toEqual(200);

    const user = await dal.findUser({ query: { email: email.toLowerCase() } });

    twoStepAuthSecretKey = user.twoFactorAuth.secret;
  });

  it("two-factor-auth/activation: Success", async () => {
    const response = await supertest("http://localhost:8000")
      .put(`/api/v1/auth/two-factor-auth/activation`)
      .set("authorization", userToken)
      .send({ token: generateToken(twoStepAuthSecretKey) });

    expect(response.status).toEqual(204);

    const updatedUser = await dal.findUser({
      query: { email: email.toLowerCase() },
    });

    expect(updatedUser.twoFactorAuth.active).toEqual(true);
  });

  it("two-factor-auth/verification: Success", async () => {
    const response = await supertest("http://localhost:8000")
      .head(
        `/api/v1/auth/two-factor-auth/verification?token=${generateToken(
          twoStepAuthSecretKey
        )}`
      )
      .set("authorization", userToken);

    expect(response.status).toEqual(200);
  });

  afterAll(async () => {
    await clearDatabaseEnd().then(() => console.log("cleared"));
    sendEmailStub.restore();
  });
});
