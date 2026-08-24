/**
 * Validates and normalizes a bookmark title.
 */
export function validateBookmarkTitle(title: string): string {
  const trimmedTitle = title.trim();

  if (trimmedTitle.length === 0) {
    throw new Error("Bookmark title cannot be empty.");
  }

  return trimmedTitle;
}

/**
 * Validates a bookmark URL.
 *
 * Only HTTP and HTTPS URLs are accepted.
 */
export function validateBookmarkUrl(url: string): string {
  const trimmedUrl = url.trim();

  if (trimmedUrl.length === 0) {
    throw new Error("Bookmark URL cannot be empty.");
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(trimmedUrl);
  } catch {
    throw new Error("Bookmark URL must be a valid URL.");
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error("Bookmark URL must use HTTP or HTTPS.");
  }

  return trimmedUrl;
}

/**
 * Validates a bookmark folder ID.
 */
export function validateFolderId(folderId: string): string {
  const trimmedFolderId = folderId.trim();

  if (trimmedFolderId.length === 0) {
    throw new Error("Folder ID cannot be empty.");
  }

  return trimmedFolderId;
}