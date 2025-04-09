import {ExerciseModel} from "../models";
 import {CreateExercise} from "../common/interfaces";

const exerciseModel = new ExerciseModel();
export class ExerciseController {

    async getAllExercises() {
        return await exerciseModel.getAll();
    }
    async getExerciseById(id: number) {
        return await exerciseModel.getById(id);
    }

    async createExercise(exercise: CreateExercise) {
        return await exerciseModel.create(exercise);
    }

    updateExercise(id: string, exercise: any) {
        return exerciseModel.update(id, exercise);
    }

    async deleteExercise(id: number) {
        return await exerciseModel.delete(id);
    }
}