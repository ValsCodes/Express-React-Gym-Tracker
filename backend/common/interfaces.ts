export type MuscleGroup = {
    id: number,
    name: string
}

export type CreateMuscleGroup = {
    name: string
}

export type Exercise = {
    id: number,
    muscle_group_id: number,
    name: string
}

export type CreateExercise = {
    muscle_group_id: number,
    name: string
}

export type WorkingSet = {
    id: number,
    exercise_id:number,
    weight:number,
    repetitions:number,
    workout_id:number,
    comment:string
}

export type CreateWorkingSet = {
    exercise_id:number,
    weight:number,
    repetitions:number,
    workout_id:number,
    comment:string
}


export type Workout = {
    id:number,
    description:string,
    date_added:Date
}

export type CreateWorkout = {
    description:string,
    date_added:Date
}