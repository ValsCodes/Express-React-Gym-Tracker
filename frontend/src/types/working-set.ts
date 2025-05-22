export interface WorkingSet {
  id: number;
  exerciseId: number;
  weight: number;
  repetitions: number;
  workoutId: number;
  comment?: string;
}

export interface EditWorkingSet {
  exerciseId?: number;
  weight?: number;
  repetitions?: number;
  comment?: string;
}

export interface CreateWorkingSet {
  exerciseId?: number;
  weight?: number;
  repetitions?: number;
  workoutId: number;
  comment?: string;
}