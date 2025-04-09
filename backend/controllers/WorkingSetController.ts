import {WorkingSetModel} from "../models";
 import {CreateWorkingSet} from "../common/interfaces";

const workingSetModel = new WorkingSetModel();
export class WorkingSetController {

    async getAllWorkingSets() {
        return await workingSetModel.getAll();
    }

    async getWorkingSetById(id: number) {
        return await workingSetModel.getById(id);
    }

    async createWorkingSet(workingSet: CreateWorkingSet) {
        return await workingSetModel.create(workingSet);
    }

    updateWorkingSet(id: string, workingSet: any) {
        const idNumber = Number(id);
        return workingSetModel.update(idNumber, workingSet);
    }

    async deleteWorkingSet(id: string) {
        const idNumber = Number(id);
        return await workingSetModel.delete(idNumber);
    }
}