export type Workout = {
  id: number;
  description: string;
  date_added: Date;
};

export type WorkoutDTO = {
  id: number;
  description: string;
  dateAdded: Date;
};

export type CreateWorkoutDTO = {
  description: string;
  dateAdded: Date;
};

export type UpdateWorkoutDTO = {
  description?: string;
  dateAdded?: Date;
};
