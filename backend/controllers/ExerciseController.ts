import { ExerciseModel } from "../models";
import {  ExerciseDTO,  CreateExerciseDTO,  UpdateExerciseDTO} from "../common/interfaces/exercise";
import { ExerciseMapper } from "../common/mappers/exercise.mapper";
import { ExerciseValidator } from "../common/validators/exercise.validator";

export class ExerciseController {
  exerciseModel = new ExerciseModel();

  constructor() {
    this.exerciseModel = new ExerciseModel();
  }

  async getAllExercises(): Promise<ExerciseDTO[]> {
    const result = await this.exerciseModel.getAll();
    return ExerciseMapper.toDTOList(result);
  }

  async getExerciseById(id: number): Promise<ExerciseDTO | null> {
    const validation = ExerciseValidator.validateId(id);
    if (!validation.valid) {
      throw new Error(`${validation.errors.join(", ")}`);
    }

    const exercise = await this.exerciseModel.getById(id);
    return exercise ? ExerciseMapper.toDTO(exercise) : null;
  }

  async createExercise(exercise: CreateExerciseDTO): Promise<{ id: number; message: string }> {
    const validation = ExerciseValidator.validateCreateExercise(exercise);
    if (!validation.valid) {
      throw new Error(`${validation.errors.join(", ")}`);
    }

    const id = await this.exerciseModel.create(exercise);

    return {
      id,
      message: `exercise with ${id} created successfully`,
    };
  }

  async updateExercise(id: string, exercise: UpdateExerciseDTO): Promise<{ success: boolean; message: string }> {
    const idValidation = ExerciseValidator.validateId(id);
    if (!idValidation.valid) {
      throw new Error(`${idValidation.errors.join(", ")}`);
    }

    // TODO validate other fields
    console.log(id);
console.log(exercise);
    const success = await this.exerciseModel.update(id, exercise);

    return {
      success,
      message: success
        ? `Exercise with ${id} updated successfully`
        : `Exercise with ID ${id} failed to be updated`,
    };
  }

  async deleteExercise(id: number ): Promise<{ success: boolean; message: string }> {
    const idValidation = ExerciseValidator.validateId(id);
    if (!idValidation.valid) {
      throw new Error(`${idValidation.errors.join(", ")}`);
    }

    const success = await this.exerciseModel.delete(id);

    return {
      success,
      message: success ? `deleted successfully` : `failed to be deleted`,
    };
  }
}
