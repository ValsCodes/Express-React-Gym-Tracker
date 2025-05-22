import { CreateExerciseDTO, UpdateExerciseDTO } from "../interfaces/exercise";
import { CommonValidator } from "./common.validator";
import { ErrorResponse } from "./errors";

export class ExerciseValidator extends CommonValidator {
  static validateCreateExercise(data: CreateExerciseDTO): ErrorResponse {
    const errors: string[] = [];

    if (!data.name || typeof data.name !== "string" || data.name.length < 3) {
      errors.push("Exercise name must be a string with at least 3 characters");
    }

    if(data.muscleGroupId !== null)
    {
    const numMuscleGroupId = Number(data.muscleGroupId);
    if (
      isNaN(numMuscleGroupId) ||
      numMuscleGroupId <= 0 ||
      !Number.isInteger(numMuscleGroupId)
    ) {
      errors.push("Invalid Muscle Group ID provided");
    }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
