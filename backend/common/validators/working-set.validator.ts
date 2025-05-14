import {
  CreateWorkingSetDTO,
  UpdateWorkingSetDTO,
} from "../interfaces/working-set";
import { ErrorResponse } from "./errors";
import {CommonValidator} from "./common.validator";

export class WorkingSetValidator extends CommonValidator{
  static validateExercise(
    data: CreateWorkingSetDTO | UpdateWorkingSetDTO
  ): ErrorResponse {
    const errors: string[] = [];

    if (data.exerciseId <= 0 || !Number.isInteger(data.exerciseId)) {
      errors.push("Invalid Exercise ID provided");
    }

    if (data.weight <= 0 || !Number.isInteger(data.weight)) {
      errors.push("Invalid Weight provided");
    }

    if (data.repetitions <= 0 || !Number.isInteger(data.repetitions)) {
      errors.push("Invalid Repetitions provided");
    }

    if (data.workoutId <= 0 || !Number.isInteger(data.workoutId)) {
      errors.push("Invalid Workout Id provided");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
