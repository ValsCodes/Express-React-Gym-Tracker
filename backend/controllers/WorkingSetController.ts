import { WorkingSetModel } from "../models";
import {
  WorkingSetDTO,
  CreateWorkingSetDTO,
  UpdateWorkingSetDTO,
} from "../common/interfaces/working-set";
import { WorkingSetMapper } from "../common/mappers/working-set.mapper";
import { WorkingSetValidator } from "../common/validators/working-set.validator";

export class WorkingSetController {
  private model = new WorkingSetModel();

  async getAllWorkingSets(): Promise<WorkingSetDTO[]> {
    const all = await this.model.getAll();
    return WorkingSetMapper.toDTOList(all);
  }

  async getWorkingSetById(id: number): Promise<WorkingSetDTO | null> {
    const validation = WorkingSetValidator.validateId(id);
    if (!validation.valid) {
      throw new Error(validation.errors.join(", "));
    }

    const ws = await this.model.getById(id);
    return ws ? WorkingSetMapper.toDTO(ws) : null;
  }

  async createWorkingSet(
    dto: CreateWorkingSetDTO
  ): Promise<{ id: number; message: string }> {
    const validation = WorkingSetValidator.validateExercise(dto);
    if (!validation.valid) {
      throw new Error(validation.errors.join(", "));
    }

    const id = await this.model.create(dto);
    return {
      id,
      message: `Working set ${id} created successfully.`,
    };
  }
async updateWorkingSet(
    id: number,
    dto: UpdateWorkingSetDTO
  ): Promise<{ success: boolean; message: string }> {
    const idValidation = WorkingSetValidator.validateId(id);
    if (!idValidation.valid) {
      throw new Error(idValidation.errors.join(", "));
    }

    const bodyValidation = WorkingSetValidator.validateExercise(dto);
    if (!bodyValidation.valid) {
      throw new Error(bodyValidation.errors.join(", "));
    }

    const success = await this.model.update(id, dto);
    return {
      success,
      message: success
        ? `Working set ${id} updated successfully.`
        : `Working set ${id} could not be updated.`,
    };
  }

  async deleteWorkingSet(
    id: number
  ): Promise<{ success: boolean; message: string }> {
    const validation = WorkingSetValidator.validateId(id);
    if (!validation.valid) {
      throw new Error(validation.errors.join(", "));
    }

    const success = await this.model.delete(id);
    return {
      success,
      message: success
        ? `Working set ${id} deleted successfully.`
        : `Failed to delete working set ${id}.`,
    };
  }
}
