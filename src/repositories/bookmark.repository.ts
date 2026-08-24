import { prisma } from "../db/prisma";

/**
 * Input required to create a bookmark.
 *
 * Keeping the input type separate from Prisma's generated types
 * makes the repository API explicit and easier to use from the
 * service/API layers later.
 */
export interface CreateBookmarkInput {
  title: string;
  url: string;
  tags?: string[];
  folderId: string;
}

/**
 * Creates a bookmark inside an existing folder.
 *
 * The folderId is stored as a foreign key in PostgreSQL, so the
 * database guarantees that the referenced folder exists.
 */
export async function createBookmark(input: CreateBookmarkInput) {
  return prisma.bookmark.create({
    data: {
      title: input.title,
      url: input.url,
      tags: input.tags ?? [],
      folderId: input.folderId,
    },
  });
}

/**
 * Retrieves a bookmark using its unique ID.
 */
export async function getBookmarkById(id: string) {
  return prisma.bookmark.findUnique({
    where: {
      id,
    },
  });
}

/**
 * Lists bookmarks belonging to a specific folder.
 *
 * Results are ordered from newest to oldest so that recently
 * created bookmarks appear first.
 */
export async function listBookmarksByFolder(folderId: string) {
  return prisma.bookmark.findMany({
    where: {
      folderId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Input fields that can be changed on an existing bookmark.
 *
 * All properties are optional because this operation represents
 * a partial update.
 */
export interface UpdateBookmarkInput {
  title?: string;
  url?: string;
  tags?: string[];
  folderId?: string;
}

/**
 * Updates only the fields supplied by the caller.
 */
export async function updateBookmark(
  id: string,
  input: UpdateBookmarkInput,
) {
  return prisma.bookmark.update({
    where: {
      id,
    },
    data: input,
  });
}

/**
 * Deletes a bookmark by its unique ID.
 */
export async function deleteBookmark(id: string) {
  return prisma.bookmark.delete({
    where: {
      id,
    },
  });
}