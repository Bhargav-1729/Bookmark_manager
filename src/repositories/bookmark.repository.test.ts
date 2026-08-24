import { afterAll, beforeEach, describe, expect, test } from "bun:test";

import { prisma } from "../db/prisma";
import { createFolder } from "./folder.repository";
import {
  createBookmark,
  deleteBookmark,
  getBookmarkById,
  listBookmarksByFolder,
  updateBookmark,
} from "./bookmark.repository";

describe("Bookmark repository", () => {
  /**
   * Each test starts with an empty database.
   *
   * Bookmarks must be deleted before folders because Bookmark
   * contains a foreign key referencing Folder.
   */
  beforeEach(async () => {
    await prisma.bookmark.deleteMany();
    await prisma.folder.deleteMany();
  });

  /**
   * Close Prisma when all tests have finished.
   */
  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("creates and retrieves a bookmark", async () => {
    const folder = await createFolder("Development");

    const bookmark = await createBookmark({
      title: "Bun Documentation",
      url: "https://bun.sh/docs",
      tags: ["bun", "typescript"],
      folderId: folder.id,
    });

    expect(bookmark.title).toBe("Bun Documentation");
    expect(bookmark.url).toBe("https://bun.sh/docs");
    expect(bookmark.tags).toEqual(["bun", "typescript"]);
    expect(bookmark.folderId).toBe(folder.id);

    const savedBookmark = await getBookmarkById(bookmark.id);

    expect(savedBookmark).not.toBeNull();
    expect(savedBookmark?.title).toBe("Bun Documentation");
  });

  test("lists bookmarks belonging to a folder", async () => {
    const folder = await createFolder("Development");

    await createBookmark({
      title: "Bun",
      url: "https://bun.sh",
      folderId: folder.id,
    });

    await createBookmark({
      title: "Prisma",
      url: "https://www.prisma.io",
      folderId: folder.id,
    });

    const bookmarks = await listBookmarksByFolder(folder.id);

    expect(bookmarks).toHaveLength(2);
    expect(bookmarks[0]?.title).toBe("Prisma");
    expect(bookmarks[1]?.title).toBe("Bun");
  });

  test("updates a bookmark", async () => {
    const folder = await createFolder("Development");

    const bookmark = await createBookmark({
      title: "Old Title",
      url: "https://example.com",
      folderId: folder.id,
    });

    const updatedBookmark = await updateBookmark(bookmark.id, {
      title: "New Title",
      tags: ["updated"],
    });

    expect(updatedBookmark.title).toBe("New Title");
    expect(updatedBookmark.tags).toEqual(["updated"]);
    expect(updatedBookmark.url).toBe("https://example.com");
  });

  test("deletes a bookmark", async () => {
    const folder = await createFolder("Development");

    const bookmark = await createBookmark({
      title: "Temporary Bookmark",
      url: "https://example.com",
      folderId: folder.id,
    });

    await deleteBookmark(bookmark.id);

    const deletedBookmark = await getBookmarkById(bookmark.id);

    expect(deletedBookmark).toBeNull();
  });

  test("deleting a folder cascades to its bookmarks", async () => {
    const folder = await createFolder("Development");

    await createBookmark({
      title: "Bun",
      url: "https://bun.sh",
      folderId: folder.id,
    });

    await prisma.folder.delete({
      where: {
        id: folder.id,
      },
    });

    const remainingBookmarks = await prisma.bookmark.findMany();

    expect(remainingBookmarks).toHaveLength(0);
  });
});