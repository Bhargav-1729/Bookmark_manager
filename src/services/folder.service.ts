import {
  createFolder as createFolderRepository,
  deleteFolder as deleteFolderRepository,
  getFolderById as getFolderByIdRepository,
  listFolders as listFoldersRepository,
} from "../repositories/folder.repository";

import { FolderNotFoundError } from "../errors/domain-error";

/**
 * Creates a new folder.
 *
 * Business logic will eventually live in this layer instead
 * of being placed directly inside GraphQL resolvers.
 */
export async function createFolder(name: string) {
  return createFolderRepository(name);
}

/**
 * Retrieves a folder and converts a missing database record
 * into a meaningful domain error.
 */
export async function getFolderById(id: string) {
  const folder = await getFolderByIdRepository(id);

  if (!folder) {
    throw new FolderNotFoundError(id);
  }

  return folder;
}

/**
 * Returns all folders.
 */
export async function listFolders() {
  return listFoldersRepository();
}

/**
 * Deletes a folder after confirming that it exists.
 */
export async function deleteFolder(id: string) {
  await getFolderById(id);

  return deleteFolderRepository(id);
}