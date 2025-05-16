export type Exercise = {
  id: number;
  muscle_group_id: number;
  name: string;
};

export type ExerciseDTO = {
  id: number;
  muscleGroupId: number;
  name: string;
};

export type CreateExerciseDTO = {
  muscleGroupId: number;
  name: string;
};

export type UpdateExerciseDTO = {
  muscleGroupId?: number;
  name?: string;
}