import { WorkoutModel } from "../models";
import {
  WorkoutDTO,
  CreateWorkoutDTO,
  UpdateWorkoutDTO,
} from "../common/interfaces/workout";
import { WorkoutMapper } from "../common/mappers/workout.mapper";
import { WorkoutValidator } from "../common/validators/workout.validator";

export class WorkoutController {
  private model = new WorkoutModel();

  async getAllWorkouts(): Promise<WorkoutDTO[]> {
    const all = await this.model.getAll();
    return WorkoutMapper.toDTOList(all);
  }

  async getWorkoutById(id: number): Promise<WorkoutDTO | null> {
    const validation = WorkoutValidator.validateId(id);
    if (!validation.valid) {
      throw new Error(validation.errors.join(", "));
    }

    const workout = await this.model.getById(id);
    return workout ? WorkoutMapper.toDTO(workout) : null;
  }

  async createWorkout(
    dto: CreateWorkoutDTO
  ): Promise<{ id: number; message: string }> {
    const validation = WorkoutValidator.validateWorkout(dto);
    if (!validation.valid) {
      throw new Error(validation.errors.join(", "));
    }

    const id = await this.model.create(dto);
    return {
      id,
      message: `Workout ${id} created successfully.`,
    };
  }

  async updateWorkout(
    id: number,
    dto: UpdateWorkoutDTO
  ): Promise<{ success: boolean; message: string }> {
    const idValidation = WorkoutValidator.validateId(id);
    if (!idValidation.valid) {
      throw new Error(idValidation.errors.join(", "));
    }

    const bodyValidation = WorkoutValidator.validateWorkout(dto);
    if (!bodyValidation.valid) {
      throw new Error(bodyValidation.errors.join(", "));
    }

    const success = await this.model.update(id, dto);
    return {
      success,
      message: success
        ? `Workout ${id} updated successfully.`
        : `Workout ${id} could not be updated.`,
    };
  }

  async deleteWorkout(
    id: number
  ): Promise<{ success: boolean; message: string }> {
    const validation = WorkoutValidator.validateId(id);
    if (!validation.valid) {
      throw new Error(validation.errors.join(", "));
    }

    const success = await this.model.delete(id);
    return {
      success,
      message: success
        ? `Workout ${id} deleted successfully.`
        : `Failed to delete workout ${id}.`,
    };
  }
}
