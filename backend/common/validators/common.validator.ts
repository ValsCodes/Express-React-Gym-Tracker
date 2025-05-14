import { ErrorResponse } from "./errors";

export class CommonValidator {
  static validateId(id: string | number): ErrorResponse {
    const errors: string[] = [];

    const numId = Number(id);
    if (isNaN(numId) || numId <= 0 || !Number.isInteger(numId)) {
      errors.push("Invalid ID provided");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static validateName(name: string): ErrorResponse {
    const errors: string[] = [];

    if (name.length < 3) {
      errors.push("Object 'Name' must be at least 3 characters");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
