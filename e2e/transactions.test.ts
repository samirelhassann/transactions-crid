import { expect, it, beforeAll, afterAll, describe, beforeEach } from "vitest";
import { execSync } from "node:child_process";
import request from "supertest";

import { app } from "../src/app";

describe("Transactions routes", () => {
  beforeAll(async () => {
    process.env.NODE_ENV = "DEV";
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("yarn knex migrate:rollback --all");
    execSync("yarn knex migrate:latest");
  });

  it("should be able to create a new transaction", async () => {
    const response = await request(app.server).post("/transactions").send({
      title: "transaction",
      amount: 100,
      type: "credit",
    });

    console.log("cookies", response.get("set-cookie"));

    expect(response.status).toBe(201);
  });

  it("should be able to list all transactions", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "transaction",
        amount: 100,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("set-cookie");

    const listTransactions = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies);

    expect(listTransactions.status).toBe(200);
    expect(listTransactions.body).toEqual({
      transactions: [
        expect.objectContaining({
          title: "transaction",
          amount: 100,
        }),
      ],
    });
  });

  it("should be able to get the summary", async () => {
    const transactionMock = {
      title: "transaction1",
      amount: 3,
      type: "credit",
    };

    const transactionMock2 = {
      title: "transaction2",
      amount: 2,
      type: "debit",
    };

    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({ ...transactionMock });

    const cookies = createTransactionResponse.get("set-cookie");

    await request(app.server)
      .post("/transactions")
      .send({ ...transactionMock2 })
      .set("Cookie", cookies);

    const transactionsSummaryResponse = await request(app.server)
      .get("/transactions/summary")
      .set("Cookie", cookies);

    expect(transactionsSummaryResponse.statusCode).toBe(200);
    expect(transactionsSummaryResponse.body).toEqual({
      summary: {
        amount: 1,
      },
    });
  });

  it("should be able to get a specific transaction", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "transaction",
        amount: 100,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("set-cookie");

    const listTransactions = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies);

    expect(listTransactions.status).toBe(200);
    expect(listTransactions.body).toEqual({
      transactions: [
        expect.objectContaining({
          title: "transaction",
          amount: 100,
        }),
      ],
    });
  });
});
