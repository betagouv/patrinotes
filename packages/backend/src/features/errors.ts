export class AppError {
  constructor(
    public status: number,
    public message: string,
  ) {}
}

// The request does not match the route schema (TypeBox): a client error, answered with a generic message
// that does not echo the schema details.
export const VALIDATION_ERROR_MESSAGE = "Requête invalide";

export const isValidationError = (error: unknown) =>
  typeof error === "object" && error !== null && Array.isArray((error as { validation?: unknown }).validation);
