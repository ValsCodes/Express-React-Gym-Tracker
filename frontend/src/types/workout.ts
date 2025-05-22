export interface Workout {
  id: number;
  description: string;
  dateAdded: string;
}

export interface EditWorkout {
  description?: string;
}

export interface CreateWorkout {
  description: string;
  dateAdded?: Date;
}