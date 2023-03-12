import fastify from "fastify";
import fastifyCookie from "@fastify/cookie";

import { transactionsRoutes } from "./routes/transactions";

export const app = fastify();

app.register(fastifyCookie);

app.addHook("preHandler", async (request) => {
  const { method, url } = request;

  console.log(`[${method}] ${url}`);
});

app.register(transactionsRoutes, {
  prefix: "/transactions",
});
