import {  WorkingSet,  WorkingSetDTO,  CreateWorkingSetDTO,  UpdateWorkingSetDTO} from "../interfaces/working-set";

export class WorkingSetMapper {
  static toDTO(workingSet: WorkingSet): WorkingSetDTO {
    return {
      exerciseId: workingSet.exercise_id,
      weight: workingSet.weight,
      repetitions: workingSet.repetitions,
      workoutId: workingSet.workout_id,
      comment: workingSet.comment
    };
  }

  static toDTOList(workingSets: WorkingSet[]): WorkingSetDTO[] {
    return workingSets.map(e => this.toDTO(e));
  }

  static toDBModel(dto: CreateWorkingSetDTO): Omit<WorkingSet, "id"> {
    return {
      exercise_id: dto.exerciseId,
      weight: dto.weight,
      repetitions: dto.repetitions,
      workout_id: dto.workoutId,
      comment: dto.comment
    };
  }

  static toUpdateDBModel(
    dto: UpdateWorkingSetDTO
  ): Partial<Omit<WorkingSet, "id">> {
    const result: Partial<Omit<WorkingSet, "id">> = {};

    if (dto.exerciseId !== undefined) {
      result.exercise_id = dto.exerciseId;
    }
    if (dto.weight !== undefined) {
      result.weight = dto.weight;
    }
    if (dto.repetitions !== undefined) {
      result.repetitions = dto.repetitions;
    }
    if (dto.workoutId !== undefined) {
      result.workout_id = dto.workoutId;
    }
    if (dto.comment !== undefined) {
      result.comment = dto.comment;
    }

    return result;
  }
}
