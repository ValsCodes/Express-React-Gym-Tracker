import {  MuscleGroup, MuscleGroupDTO, CreateMuscleGroupDTO, UpdateMuscleGroupDTO} from "../interfaces/muscle-group";

export class MuscleGroupMapper {
  static toDTO(muscleGroup: MuscleGroup): MuscleGroupDTO {
    return {
      id: muscleGroup.id,
      name: muscleGroup.name
    };
  }

  static toDTOList(muscleGroups: MuscleGroup[]): MuscleGroupDTO[] {
    return muscleGroups.map(e => this.toDTO(e));
  }

  static toDBModel(dto: CreateMuscleGroupDTO): Omit<MuscleGroup, "id"> {
    return {
      name: dto.name
    };
  }

  static toUpdateDBModel(dto: UpdateMuscleGroupDTO  ): Partial<Omit<MuscleGroup, "id">> {
    const result: Partial<Omit<MuscleGroup, "id">> = {};

    if (dto.name !== undefined) {
      result.name = dto.name;
    }

    return result;
  }
}
