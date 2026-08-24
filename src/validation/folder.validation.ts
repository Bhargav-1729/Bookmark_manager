/**
 * Validates a folder name.
 *
 * Folder names are required and cannot be empty after trimming
 * whitespace.
 */
export function validateFolderName(name: string): string {
  const trimmedName = name.trim();

  if (trimmedName.length === 0) {
    throw new Error("Folder name cannot be empty.");
  }

  return trimmedName;
}