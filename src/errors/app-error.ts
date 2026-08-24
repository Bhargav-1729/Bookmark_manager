/**
 * Base error used for expected application-level failures.
 *
 * These errors are safe to expose through the GraphQL API.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);

    this.name = "AppError";
  }
}