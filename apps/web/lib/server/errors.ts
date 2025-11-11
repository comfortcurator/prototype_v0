import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly options?: { cause?: unknown; status?: number }
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const formatZodError = (error: ZodError) =>
  error.errors.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");

