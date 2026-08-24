import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";

import { prisma } from "../db/prisma";
import { schema } from "./schema";

/**
 * GraphQL Yoga provides the HTTP transport layer.
 *
 * The schema contains both the GraphQL type definitions and
 * their resolver functions.
 */
export const yoga = createYoga({
  schema,
  graphqlEndpoint: "/graphql",
});

const port = Number(process.env.PORT ?? 4000);

const server = createServer(async (req, res) => {
  /**
   * Health check endpoint.
   *
   * Verifies that the application is running and can
   * successfully communicate with PostgreSQL.
   */
  if (req.url === "/health") {
    try {
      await prisma.$queryRaw`SELECT 1`;

      res.writeHead(200, {
        "Content-Type": "application/json",
      });

      res.end(
        JSON.stringify({
          status: "ok",
          database: "connected",
        }),
      );

      return;
    } catch (error) {
      console.error("Health check failed:", error);

      res.writeHead(503, {
        "Content-Type": "application/json",
      });

      res.end(
        JSON.stringify({
          status: "error",
          database: "disconnected",
        }),
      );

      return;
    }
  }

  /**
   * All other requests are handled by GraphQL Yoga.
   */
  const response = await yoga.fetch(
    new Request(`http://${req.headers.host}${req.url}`, {
      method: req.method,
      headers: req.headers as Record<string, string>,
    }),
  );

  res.writeHead(response.status, Object.fromEntries(response.headers));

  res.end(await response.text());
});

server.listen(port, () => {
  console.log(`GraphQL server running at http://localhost:${port}/graphql`);
  console.log(`Health check available at http://localhost:${port}/health`);
});