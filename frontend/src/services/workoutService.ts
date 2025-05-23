import {Workout, CreateWorkout, EditWorkout} from "../types/index.ts"

export async function fetchWorkouts() {
  const response = await fetch(`/workout`);
  return response.json() as Promise<Workout[]>;
}

export async function createWorkout(payload: CreateWorkout) {
  const response = await fetch("/workout", { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } });
  return response.json();
}

export async function updateWorkout(id: number, payload: EditWorkout) {
  const response = await fetch(`/workout/${id}`, { method: "PUT", body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } });
  return response.json();
}

export async function deleteWorkout(id: number) {
  const response = await fetch(`/workout/${id}`, { method: "DELETE" });
  return response.json();
}