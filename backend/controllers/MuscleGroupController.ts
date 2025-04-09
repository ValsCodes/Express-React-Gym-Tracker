import { CreateMuscleGroup } from "../common/interfaces";
import {MuscleGroupModel} from "../models";
// import {CreateUser} from "../common/interfaces";

const muscleGroupModel = new MuscleGroupModel();
export class MuscleGroupController {

    async getAllMuscleGroups() {
        return await muscleGroupModel.getAll();
    }

    async getMuscleGroupById(id: number) {
        return await muscleGroupModel.getById(id);
    }

    async createMuscleGroup(muscleGroup: CreateMuscleGroup) {
        return await muscleGroupModel.create(muscleGroup);
    }

    updateMuscleGroup(id: string, muscleGroup: any) {
        const idNumber = Number(id);
        return muscleGroupModel.update(idNumber, muscleGroup);
    }

    async deleteMuscleGroup(id: string) {
        const idNumber = Number(id);
        return await muscleGroupModel.delete(idNumber);
    }
}