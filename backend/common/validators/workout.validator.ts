import { CreateWorkoutDTO, UpdateWorkoutDTO } from "../interfaces/workout";
import { ErrorResponse } from "./errors";
import {CommonValidator} from "./common.validator";

export class WorkoutValidator extends CommonValidator{
  static validateWorkout(
    data: CreateWorkoutDTO | UpdateWorkoutDTO
  ): ErrorResponse {
    const errors: string[] = [];

    if (data.dateAdded == null) {
      errors.push("Invalid Date provided");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
