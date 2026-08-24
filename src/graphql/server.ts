import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";

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

const server = createServer(yoga);

server.listen(port, () => {
  console.log(`GraphQL server running at http://localhost:${port}/graphql`);
});