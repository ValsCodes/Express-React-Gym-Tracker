import {WorkingSet, CreateWorkingSet, EditWorkingSet} from "../types/index.ts"

export async function fetchWorkingSets(workoutId: number) {
  const response = await fetch(`/workout/${workoutId}/working-sets`);
  return response.json() as Promise<WorkingSet[]>;
}

export async function createWorkingSet(payload: CreateWorkingSet) {
  const response = await fetch("/working-set", { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } });
  return response.json();
}

export async function updateWorkingSet(id: number, payload: EditWorkingSet) {
  const response = await fetch(`/working-set/${id}`, { method: "PUT", body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } });
  return response.json();
}

export async function deleteWorkingSet(id: number) {
  const response = await fetch(`/working-set/${id}`, { method: "DELETE" });
  return response.json();
}