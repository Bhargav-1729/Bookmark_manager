import { AppError } from "./app-error";

/**
 * Raised when a requested folder does not exist.
 */
export class FolderNotFoundError extends AppError {
  constructor(folderId: string) {
    super(`Folder not found: ${folderId}`, "FOLDER_NOT_FOUND");
  }
}

/**
 * Raised when a requested bookmark does not exist.
 */
export class BookmarkNotFoundError extends AppError {
  constructor(bookmarkId: string) {
    super(`Bookmark not found: ${bookmarkId}`, "BOOKMARK_NOT_FOUND");
  }
}