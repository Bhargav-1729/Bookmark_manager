import { afterAll, beforeEach, describe, expect, test } from "bun:test";
import { graphql } from "graphql";

import { prisma } from "../db/prisma";
import { schema } from "./schema";

interface CreateFolderResponse {
  createFolder: {
    id: string;
    name: string;
    createdAt: string;
  };
}

interface FolderListResponse {
  folders: Array<{
    id: string;
    name: string;
    createdAt: string;
  }>;
}

interface GetFolderResponse {
  folder: {
    id: string;
    name: string;
  } | null;
}

describe("GraphQL API", () => {
  beforeEach(async () => {
    await prisma.bookmark.deleteMany();
    await prisma.folder.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("creates and lists folders", async () => {
    const mutation = await graphql({
      schema,
      source: `
        mutation {
          createFolder(name: "Development") {
            id
            name
            createdAt
          }
        }
      `,
    });

    expect(mutation.errors).toBeUndefined();

    const mutationData = mutation.data as unknown as CreateFolderResponse;

    expect(mutationData.createFolder.name).toBe("Development");

    const query = await graphql({
      schema,
      source: `
        query {
          folders {
            id
            name
            createdAt
          }
        }
      `,
    });

    expect(query.errors).toBeUndefined();

    const queryData = query.data as unknown as FolderListResponse;

    expect(queryData.folders).toHaveLength(1);
    expect(queryData.folders[0]?.name).toBe("Development");
  });

  test("retrieves a folder by ID", async () => {
    const folder = await prisma.folder.create({
      data: {
        name: "Testing",
      },
    });

    const result = await graphql({
      schema,
      source: `
        query GetFolder($id: ID!) {
          folder(id: $id) {
            id
            name
          }
        }
      `,
      variableValues: {
        id: folder.id,
      },
    });

    expect(result.errors).toBeUndefined();

    const resultData = result.data as unknown as GetFolderResponse;

    expect(resultData.folder?.id).toBe(folder.id);
    expect(resultData.folder?.name).toBe("Testing");
  });

  test("creates and retrieves a bookmark", async () => {
    const folder = await prisma.folder.create({
      data: {
        name: "Development",
      },
    });

    const result = await graphql({
      schema,
      source: `
        mutation CreateBookmark(
          $title: String!
          $url: String!
          $tags: [String!]
          $folderId: ID!
        ) {
          createBookmark(
            title: $title
            url: $url
            tags: $tags
            folderId: $folderId
          ) {
            id
            title
            url
            tags
            folderId
            createdAt
          }
        }
      `,
      variableValues: {
        title: "Bun Documentation",
        url: "https://bun.sh/docs",
        tags: ["bun", "typescript"],
        folderId: folder.id,
      },
    });

    expect(result.errors).toBeUndefined();

    const data = result.data as {
      createBookmark: {
        id: string;
        title: string;
        url: string;
        tags: string[];
        folderId: string;
      };
    };

    expect(data.createBookmark.title).toBe("Bun Documentation");
    expect(data.createBookmark.url).toBe("https://bun.sh/docs");
    expect(data.createBookmark.tags).toEqual(["bun", "typescript"]);
    expect(data.createBookmark.folderId).toBe(folder.id);

    const query = await graphql({
      schema,
      source: `
        query GetBookmark($id: ID!) {
          bookmark(id: $id) {
            id
            title
            url
            tags
            folderId
          }
        }
      `,
      variableValues: {
        id: data.createBookmark.id,
      },
    });

    expect(query.errors).toBeUndefined();

    const bookmarkData = query.data as {
      bookmark: {
        id: string;
        title: string;
        folderId: string;
      };
    };

    expect(bookmarkData.bookmark.title).toBe("Bun Documentation");
    expect(bookmarkData.bookmark.folderId).toBe(folder.id);
  });

  test("lists bookmarks through a folder", async () => {
    const folder = await prisma.folder.create({
      data: {
        name: "Development",
      },
    });

    await prisma.bookmark.create({
      data: {
        title: "Bun",
        url: "https://bun.sh",
        folderId: folder.id,
      },
    });

    const result = await graphql({
      schema,
      source: `
        query GetFolder($id: ID!) {
          folder(id: $id) {
            id
            name
            bookmarks {
              id
              title
              url
              tags
            }
          }
        }
      `,
      variableValues: {
        id: folder.id,
      },
    });

    expect(result.errors).toBeUndefined();

    const data = result.data as {
      folder: {
        id: string;
        bookmarks: Array<{
          id: string;
          title: string;
          url: string;
          tags: string[];
        }>;
      };
    };

    expect(data.folder.id).toBe(folder.id);
    expect(data.folder.bookmarks).toHaveLength(1);
    expect(data.folder.bookmarks[0]?.title).toBe("Bun");
  });

  test("updates a bookmark", async () => {
    const folder = await prisma.folder.create({
      data: {
        name: "Development",
      },
    });

    const bookmark = await prisma.bookmark.create({
      data: {
        title: "Old Title",
        url: "https://example.com",
        folderId: folder.id,
      },
    });

    const result = await graphql({
      schema,
      source: `
        mutation UpdateBookmark(
          $id: ID!
          $title: String
          $tags: [String!]
        ) {
          updateBookmark(
            id: $id
            title: $title
            tags: $tags
          ) {
            id
            title
            url
            tags
          }
        }
      `,
      variableValues: {
        id: bookmark.id,
        title: "New Title",
        tags: ["updated"],
      },
    });

    expect(result.errors).toBeUndefined();

    const data = result.data as {
      updateBookmark: {
        id: string;
        title: string;
        url: string;
        tags: string[];
      };
    };

    expect(data.updateBookmark.title).toBe("New Title");
    expect(data.updateBookmark.url).toBe("https://example.com");
    expect(data.updateBookmark.tags).toEqual(["updated"]);
  });

  test("deletes a bookmark", async () => {
    const folder = await prisma.folder.create({
      data: {
        name: "Development",
      },
    });

    const bookmark = await prisma.bookmark.create({
      data: {
        title: "Temporary",
        url: "https://example.com",
        folderId: folder.id,
      },
    });

    const result = await graphql({
      schema,
      source: `
        mutation DeleteBookmark($id: ID!) {
          deleteBookmark(id: $id)
        }
      `,
      variableValues: {
        id: bookmark.id,
      },
    });

    expect(result.errors).toBeUndefined();

    const data = result.data as {
      deleteBookmark: string;
    };

    expect(data.deleteBookmark).toBe(bookmark.id);

    const deletedBookmark = await prisma.bookmark.findUnique({
      where: {
        id: bookmark.id,
      },
    });

    expect(deletedBookmark).toBeNull();
  });
});