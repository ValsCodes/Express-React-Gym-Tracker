export type WorkingSet = {
  id: number;
  exercise_id: number;
  weight: number;
  repetitions: number;
  workout_id: number;
  comment?: string;
};

export type WorkingSetDTO = {
  id: number;
  exerciseId: number;
  weight: number;
  repetitions: number;
  workoutId: number;
  comment?: string;
};

export type CreateWorkingSetDTO = {
  exerciseId: number;
  weight: number;
  repetitions: number;
  workoutId: number;
  comment?: string;
};

export type UpdateWorkingSetDTO = {
  exerciseId?: number;
  weight?: number;
  repetitions?: number;
  workoutId?: number;
  comment?: string;
};
