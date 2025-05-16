import {  Exercise,  ExerciseDTO,  CreateExerciseDTO,  UpdateExerciseDTO} from "../interfaces/exercise";

export class ExerciseMapper {
  static toDTO(exercise: Exercise): ExerciseDTO {
    return {
      id: exercise.id,
      muscleGroupId: exercise.muscle_group_id,
      name: exercise.name,
    };
  }

  static toDTOList(exercises: Exercise[]): ExerciseDTO[] {
    return exercises.map((e) => this.toDTO(e));
  }

  static toDBModel(dto: CreateExerciseDTO): Omit<Exercise, "id"> {
    return {
      muscle_group_id: dto.muscleGroupId,
      name: dto.name,
    };
  }

  static toUpdateDBModel(dto: UpdateExerciseDTO  ): Partial<Omit<Exercise, "id">> {
    const result: Partial<Omit<Exercise, "id">> = {};

    if (dto.muscleGroupId !== undefined) {
      result.muscle_group_id = dto.muscleGroupId;
    }

    if (dto.name !== undefined) {
      result.name = dto.name;
    }

    return result;
  }
}
