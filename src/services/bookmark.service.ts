import {
  createBookmark as createBookmarkRepository,
  deleteBookmark as deleteBookmarkRepository,
  getBookmarkById as getBookmarkByIdRepository,
  listBookmarksByFolder as listBookmarksByFolderRepository,
  updateBookmark as updateBookmarkRepository,
} from "../repositories/bookmark.repository";

import {
  BookmarkNotFoundError,
  FolderNotFoundError,
} from "../errors/domain-error";

import { getFolderById } from "../repositories/folder.repository";

import type {
  CreateBookmarkInput,
  UpdateBookmarkInput,
} from "../repositories/bookmark.repository";

/**
 * Creates a bookmark after verifying that its folder exists.
 */
export async function createBookmark(input: CreateBookmarkInput) {
  const folder = await getFolderById(input.folderId);

  if (!folder) {
    throw new FolderNotFoundError(input.folderId);
  }

  return createBookmarkRepository(input);
}

/**
 * Retrieves a bookmark and throws a domain error when it
 * doesn't exist.
 */
export async function getBookmarkById(id: string) {
  const bookmark = await getBookmarkByIdRepository(id);

  if (!bookmark) {
    throw new BookmarkNotFoundError(id);
  }

  return bookmark;
}

/**
 * Lists bookmarks belonging to a folder.
 *
 * The folder is checked first so that requesting bookmarks
 * for a nonexistent folder produces a meaningful error.
 */
export async function listBookmarksByFolder(folderId: string) {
  const folder = await getFolderById(folderId);

  if (!folder) {
    throw new FolderNotFoundError(folderId);
  }

  return listBookmarksByFolderRepository(folderId);
}

/**
 * Updates a bookmark after confirming that it exists.
 *
 * If the folder is being changed, the new folder must also exist.
 */
export async function updateBookmark(
  id: string,
  input: UpdateBookmarkInput,
) {
  await getBookmarkById(id);

  if (input.folderId !== undefined) {
    const folder = await getFolderById(input.folderId);

    if (!folder) {
      throw new FolderNotFoundError(input.folderId);
    }
  }

  return updateBookmarkRepository(id, input);
}

/**
 * Deletes a bookmark after confirming that it exists.
 */
export async function deleteBookmark(id: string) {
  await getBookmarkById(id);

  return deleteBookmarkRepository(id);
}