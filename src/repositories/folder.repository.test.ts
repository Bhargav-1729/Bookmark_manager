import { afterAll, beforeEach, describe, expect, test } from "bun:test";

import { prisma } from "../db/prisma";
import {
  createFolder,
  deleteFolder,
  getFolderById,
  listFolders,
} from "./folder.repository";

describe("Folder repository", () => {
  /**
   * Keep the database clean between test cases.
   *
   * We delete bookmarks first because Bookmark has a foreign key
   * referencing Folder.
   */
  beforeEach(async () => {
    await prisma.bookmark.deleteMany();
    await prisma.folder.deleteMany();
  });

  /**
   * Close the database connection after the test suite finishes.
   */
  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("creates and retrieves a folder", async () => {
    const folder = await createFolder("Development");

    expect(folder.name).toBe("Development");

    const savedFolder = await getFolderById(folder.id);

    expect(savedFolder).not.toBeNull();
    expect(savedFolder?.name).toBe("Development");
  });

  test("lists folders in creation order", async () => {
    await createFolder("Development");
    await createFolder("Trading");

    const folders = await listFolders();

    expect(folders).toHaveLength(2);
    expect(folders[0]?.name).toBe("Development");
    expect(folders[1]?.name).toBe("Trading");
  });

  test("deletes a folder", async () => {
    const folder = await createFolder("Temporary");

    await deleteFolder(folder.id);

    const deletedFolder = await getFolderById(folder.id);

    expect(deletedFolder).toBeNull();
  });
});