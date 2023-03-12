import { knex as setupKnex, Knex } from "knex";
import { env } from "./env";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set.");
}

export const config: Knex.Config = {
  client: "sqlite",
  connection: {
    filename: env.DATABASE_URL,
  },

  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./tmp/db/migrations",
  },
};

export const knex = setupKnex(config);