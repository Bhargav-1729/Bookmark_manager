import { prisma } from "../db/prisma";

/**
 * Creates a new bookmark folder.
 *
 * Keeping database operations in a repository gives us a clean
 * separation between database access and the API layer.
 */
export async function createFolder(name: string) {
  return prisma.folder.create({
    data: {
      name,
    },
  });
}

/**
 * Retrieves a single folder by its unique identifier.
 *
 * `findUnique` is appropriate here because Folder.id is a
 * primary key and therefore uniquely identifies one record.
 */
export async function getFolderById(id: string) {
  return prisma.folder.findUnique({
    where: {
      id,
    },
  });
}

/**
 * Returns all folders ordered by creation time.
 *
 * Ordering explicitly is important because database row order
 * should never be relied upon implicitly.
 */
export async function listFolders() {
  return prisma.folder.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
}

/**
 * Deletes a folder by ID.
 *
 * The Prisma schema defines the Bookmark -> Folder relationship
 * with ON DELETE CASCADE, so bookmarks belonging to this folder
 * will also be removed by PostgreSQL.
 */
export async function deleteFolder(id: string) {
  return prisma.folder.delete({
    where: {
      id,
    },
  });
}