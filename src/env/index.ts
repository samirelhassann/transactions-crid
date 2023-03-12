import { config } from "dotenv";
import { z } from "zod";

if (process.env.NODE_ENV === "test") {
  config({ path: ".env.test" });
} else {
  config();
}

const envSchema = z.object({
  NODE_ENV: z.enum(["DEV", "PROD", "test"]).default("DEV"),
  DATABASE_CLIENT: z.enum(["sqlite", "pg"]),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(
    "[ERROR] • Failed to parse environment variables",
    _env.error.format()
  );

  throw new Error("Failed to parse environment variables");
}

export const env = _env.data;
