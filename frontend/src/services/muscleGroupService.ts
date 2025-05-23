import {MuscleGroup, CreateMuscleGroup, EditMuscleGroup} from "../types/index.ts"

export async function fetchMuscleGroups() {
  const response = await fetch(`/muscle-group`);
  return response.json() as Promise<MuscleGroup[]>;
}

export async function createMuscleGroup(payload: CreateMuscleGroup) {
  const response = await fetch("/muscle-group", { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } });
  return response.json();
}

export async function updateMuscleGroup(id: number, payload: EditMuscleGroup) {
  const response = await fetch(`/muscle-group/${id}`, { method: "PUT", body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } });
  return response.json();
}

export async function deleteMuscleGroup(id: number) {
  const response = await fetch(`/muscle-group/${id}`, { method: "DELETE" });
  return response.json();
}