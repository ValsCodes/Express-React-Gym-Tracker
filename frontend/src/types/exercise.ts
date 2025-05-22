export interface Exercise {
  id: number;
  name: string;
  muscleGroupId: number | null;
}

export interface EditExercise {
  name?: string;
  muscleGroupId?: number | null;
}

export interface CreateExercise  {
  name: string;
  muscleGroupId: number | null;
}