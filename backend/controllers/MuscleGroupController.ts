import { MuscleGroupModel } from "../models";
import {  MuscleGroupDTO,  CreateMuscleGroupDTO,  UpdateMuscleGroupDTO,} from "../common/interfaces/muscle-group";
import { MuscleGroupMapper } from "../common/mappers/muscle-group.mapper";
import { MuscleGroupValidator } from "../common/validators/muscle-group.validator";

export class MuscleGroupController {
  private model = new MuscleGroupModel();

  async getAllMuscleGroups(): Promise<MuscleGroupDTO[]> {
    const all = await this.model.getAll();
    return MuscleGroupMapper.toDTOList(all);
  }

  async getMuscleGroupById(id: number): Promise<MuscleGroupDTO | null> {
    const validation = MuscleGroupValidator.validateId(id);
    if (!validation.valid) {
      throw new Error(validation.errors.join(", "));
    }

    const mg = await this.model.getById(id);
    return mg ? MuscleGroupMapper.toDTO(mg) : null;
  }

  async createMuscleGroup(
    dto: CreateMuscleGroupDTO
  ): Promise<{ id: number; message: string }> {
    const validation = MuscleGroupValidator.validateName(dto.name);
    if (!validation.valid) {
      throw new Error(validation.errors.join(", "));
    }

    const id = await this.model.create(dto);
    return {
      id,
      message: `Muscle group with id ${id} created successfully.`,
    };
  }

  async updateMuscleGroup( id: number, dto: UpdateMuscleGroupDTO ): Promise<{ success: boolean; message: string }> {
    const idValidation = MuscleGroupValidator.validateId(id);
    if (!idValidation.valid) {
      throw new Error(idValidation.errors.join(", "));
    }

    const bodyValidation = MuscleGroupValidator.validateName(dto.name);
    if (!bodyValidation.valid) {
      throw new Error(bodyValidation.errors.join(", "));
    }

    const success = await this.model.update(id, dto);
    return {
      success,
      message: success
        ? `Muscle group ${id} updated successfully.`
        : `Muscle group ${id} could not be updated.`,
    };
  }

  async deleteMuscleGroup(
    id: number
  ): Promise<{ success: boolean; message: string }> {
    const validation = MuscleGroupValidator.validateId(id);
    if (!validation.valid) {
      throw new Error(validation.errors.join(", "));
    }

    const success = await this.model.delete(id);
    return {
      success,
      message: success
        ? `Muscle group ${id} deleted successfully.`
        : `Failed to delete muscle group ${id}.`,
    };
  }
}
