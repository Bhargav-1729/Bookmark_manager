import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

/**
 * PostgreSQL connection configuration.
 *
 * DATABASE_URL is stored in .env so credentials and environment-specific
 * configuration are not hard-coded into the application.
 */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.");
}

/**
 * Prisma 7 requires a driver adapter when connecting directly
 * to a database.
 *
 * PrismaPg bridges Prisma Client and the PostgreSQL driver.
 */
const adapter = new PrismaPg({
  connectionString,
});

/**
 * Shared Prisma Client instance.
 *
 * Keeping the client in one module gives the application a single,
 * reusable database access point.
 */
export const prisma = new PrismaClient({
  adapter,
});