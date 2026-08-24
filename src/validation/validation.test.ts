import { describe, expect, test } from "bun:test";

import {
  validateBookmarkTitle,
  validateBookmarkUrl,
  validateFolderId,
} from "./bookmark.validation";

import { validateFolderName } from "./folder.validation";

describe("Folder validation", () => {
  test("trims a valid folder name", () => {
    expect(validateFolderName("  Development  ")).toBe("Development");
  });

  test("rejects an empty folder name", () => {
    expect(() => validateFolderName("")).toThrow(
      "Folder name cannot be empty.",
    );
  });

  test("rejects a whitespace-only folder name", () => {
    expect(() => validateFolderName("   ")).toThrow(
      "Folder name cannot be empty.",
    );
  });
});

describe("Bookmark validation", () => {
  test("trims a valid bookmark title", () => {
    expect(validateBookmarkTitle("  Bun Documentation  ")).toBe(
      "Bun Documentation",
    );
  });

  test("rejects an empty bookmark title", () => {
    expect(() => validateBookmarkTitle("")).toThrow(
      "Bookmark title cannot be empty.",
    );
  });

  test("accepts a valid HTTPS URL", () => {
    expect(validateBookmarkUrl(" https://bun.sh/docs ")).toBe(
      "https://bun.sh/docs",
    );
  });

  test("accepts a valid HTTP URL", () => {
    expect(validateBookmarkUrl("http://example.com")).toBe(
      "http://example.com",
    );
  });

  test("rejects an invalid URL", () => {
    expect(() => validateBookmarkUrl("not-a-url")).toThrow(
      "Bookmark URL must be a valid URL.",
    );
  });

  test("rejects unsupported URL protocols", () => {
    expect(() => validateBookmarkUrl("javascript:alert(1)")).toThrow(
      "Bookmark URL must use HTTP or HTTPS.",
    );
  });

  test("trims a valid folder ID", () => {
    expect(validateFolderId("  folder-123  ")).toBe("folder-123");
  });

  test("rejects an empty folder ID", () => {
    expect(() => validateFolderId("   ")).toThrow(
      "Folder ID cannot be empty.",
    );
  });
});