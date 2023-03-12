import { knex as setupKnex, Knex } from "knex";
import { env } from "./env";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set.");
}

if (!process.env.MIGRATIONS_PATH) {
  throw new Error("MIGRATIONS_PATH is not set.");
}

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection:
    env.DATABASE_CLIENT === "sqlite"
      ? {
        filename: env.DATABASE_URL,
      }
      : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: env.MIGRATIONS_PATH,
  },
};

export const knex = setupKnex(config);
