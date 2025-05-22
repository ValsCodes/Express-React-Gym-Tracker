export type Exercise = {
  id: number;
  muscle_group_id: number | null;
  name: string;
};

export type ExerciseDTO = {
  id: number;
  muscleGroupId: number | null;
  name: string;
};

export type CreateExerciseDTO = {
  muscleGroupId: number | null;
  name: string;
};

export type UpdateExerciseDTO = {
  muscleGroupId?: number | null;
  name?: string;
}