import {Exercise, CreateExercise, EditExercise} from "../types/index.ts"

export async function fetchExercises(): Promise<Exercise[]> {
  const response = await fetch(`/exercise`);
  return response.json();
}

export async function createExercise(payload: CreateExercise) {
  const response = await fetch("/exercise", { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } });
  return response.json();
}

export async function updateExercise(id: number, payload: EditExercise) {
  const response = await fetch(`/exercise/${id}`, { method: "PUT", body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } });
  return response.json();
}

export async function deleteExercise(id: number) {
  const response = await fetch(`/exercise/${id}`, { method: "DELETE" });
  return response.json();
}