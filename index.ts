import { prisma } from "./src/db/prisma";

async function main() {
  /**
   * A simple database connectivity check.
   *
   * We query the Folder table without creating any data.
   * If Prisma can successfully execute this query, our
   * TypeScript application is connected to PostgreSQL.
   */
  const folderCount = await prisma.folder.count();

  console.log(`Database connection successful.`);
  console.log(`Current folder count: ${folderCount}`);
}

main()
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    /**
     * Disconnect Prisma when the application finishes.
     *
     * This is especially useful for short-lived scripts and
     * keeps the connection lifecycle explicit while we're
     * developing the application.
     */
    await prisma.$disconnect();
  });