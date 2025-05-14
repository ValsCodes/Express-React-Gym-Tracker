import {
  Workout,
  WorkoutDTO,
  CreateWorkoutDTO,
  UpdateWorkoutDTO,
} from "../interfaces/workout";

export class WorkoutMapper {
  static toDTO(workout: Workout): WorkoutDTO {
    return {
      id: workout.id,
      description: workout.description,
      dateAdded: workout.date_added,
    };
  }

  static toDTOList(workouts: Workout[]): WorkoutDTO[] {
    return workouts.map((e) => this.toDTO(e));
  }

  static toDBModel(dto: CreateWorkoutDTO): Omit<Workout, "id"> {
    return {
      description: dto.description,
      date_added: dto.dateAdded,
    };
  }

  static toUpdateDBModel(dto: UpdateWorkoutDTO): Partial<Omit<Workout, "id">> {
    const result: Partial<Omit<Workout, "id">> = {};

    if (dto.description !== undefined) {
      result.description = dto.description;
    }
    if (dto.dateAdded !== undefined) {
      result.date_added = dto.dateAdded;
    }

    return result;
  }
}
