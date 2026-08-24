import { afterAll, beforeEach, describe, expect, test } from "bun:test";

import { prisma } from "../db/prisma";
import {
  createBookmark,
  deleteBookmark,
  getBookmarkById,
  listBookmarksByFolder,
  updateBookmark,
} from "./bookmark.service";
import {
  createFolder,
  deleteFolder,
  getFolderById,
} from "./folder.service";

describe("Service error handling", () => {
  beforeEach(async () => {
    await prisma.bookmark.deleteMany();
    await prisma.folder.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("throws when a folder does not exist", async () => {
    await expect(
      getFolderById("missing-folder"),
    ).rejects.toThrow("Folder not found: missing-folder");
  });

  test("throws when deleting a folder that does not exist", async () => {
    await expect(
      deleteFolder("missing-folder"),
    ).rejects.toThrow("Folder not found: missing-folder");
  });

  test("throws when creating a bookmark in a missing folder", async () => {
    await expect(
      createBookmark({
        title: "Test",
        url: "https://example.com",
        folderId: "missing-folder",
      }),
    ).rejects.toThrow("Folder not found: missing-folder");
  });

  test("throws when retrieving a missing bookmark", async () => {
    await expect(
      getBookmarkById("missing-bookmark"),
    ).rejects.toThrow("Bookmark not found: missing-bookmark");
  });

  test("throws when deleting a missing bookmark", async () => {
    await expect(
      deleteBookmark("missing-bookmark"),
    ).rejects.toThrow("Bookmark not found: missing-bookmark");
  });

  test("throws when listing bookmarks for a missing folder", async () => {
    await expect(
      listBookmarksByFolder("missing-folder"),
    ).rejects.toThrow("Folder not found: missing-folder");
  });

  test("throws when updating a missing bookmark", async () => {
    await expect(
      updateBookmark("missing-bookmark", {
        title: "Updated",
      }),
    ).rejects.toThrow("Bookmark not found: missing-bookmark");
  });

  test("throws when moving a bookmark to a missing folder", async () => {
    const folder = await createFolder("Development");

    const bookmark = await createBookmark({
      title: "Bun",
      url: "https://bun.sh",
      folderId: folder.id,
    });

    await expect(
      updateBookmark(bookmark.id, {
        folderId: "missing-folder",
      }),
    ).rejects.toThrow("Folder not found: missing-folder");
  });
});