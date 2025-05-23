import React, { useMemo } from "react";
import { SlInput, SlDropdown, SlButton, SlMenu, SlMenuItem } from "../components";
import styles from "../pages/WorkingSet/WorkingSetManager.module.scss";
import { Exercise, MuscleGroup } from "../types";

export type DraftState = Partial<{
  weight: number;
  repetitions: number;
  exerciseId: number;
  comment: string;
  muscleGroupId: number;
}>;

export interface WorkingSetFormProps {
  draft: DraftState;
  onChange: (draft: DraftState) => void;
  exercises: Exercise[];
  muscleGroups: MuscleGroup[];
  onSave: (event: React.FormEvent) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export const WorkingSetForm: React.FC<WorkingSetFormProps> = ({
  draft,
  onChange,
  exercises,
  muscleGroups,
  onSave,
  onCancel,
  isSaving = false,
}) => {
  const availableExercises = useMemo(() => {
    if (!draft.muscleGroupId) {
      return exercises;
    }
    return exercises.filter(
      (ex) => ex.muscleGroupId === draft.muscleGroupId
    );
  }, [exercises, draft.muscleGroupId]);

  const selectedMuscleGroupLabel = muscleGroups.find((mg) => mg.id === draft.muscleGroupId)?.name || "Muscle Group";  
  const selectedExerciseLabel = exercises.find((ex) => ex.id === draft.exerciseId)?.name || "Exercise";

  return (
    <form className={styles.form} onSubmit={onSave}>
      <div className={styles.field}>
        <label htmlFor="weight">Weight</label>
        <SlInput
          id="weight"
          type="number"
          value={draft.weight?.toString() || ""}
          onSlInput={(e: any) =>
            onChange({ ...draft, weight: Number((e.target as any).value) })
          }
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="reps">Repetitions</label>
        <SlInput
          id="reps"
          type="number"
          value={draft.repetitions?.toString() || ""}
          onSlInput={(e: any) =>
            onChange({ ...draft, repetitions: Number((e.target as any).value) })
          }
        />
      </div>

      <div className={styles.field}>
        <label>Muscle Group</label>
        <SlDropdown hoist>
          <SlButton slot="trigger" caret>
            {selectedMuscleGroupLabel}
          </SlButton>
          <SlMenu
            onPointerDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
            onSlSelect={(e: any) => {
              const id = Number(e.detail.item.value);
              onChange({
                ...draft,
                muscleGroupId: id,
                exerciseId: undefined,
              });
            }}
          >
            {muscleGroups.map((mg) => (
              <SlMenuItem key={mg.id} value={mg.id.toString()}>
                {mg.name}
              </SlMenuItem>
            ))}
          </SlMenu>
        </SlDropdown>
      </div>

      <div className={styles.field}>
        <label>Exercise</label>
        <SlDropdown hoist>
          <SlButton slot="trigger" caret>
            {selectedExerciseLabel}
          </SlButton>
          <SlMenu
            onPointerDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
            onSlSelect={(e: any) => {
              const id = Number(e.detail.item.value);
              onChange({ ...draft, exerciseId: id });
            }}
          >
            {availableExercises.map((ex) => (
              <SlMenuItem key={ex.id} value={ex.id.toString()}>
                {ex.name}
              </SlMenuItem>
            ))}
          </SlMenu>
        </SlDropdown>
      </div>

      <div className={styles.field}>
        <label htmlFor="comment">Comment</label>
        <SlInput
          id="comment"
          value={draft.comment || ""}
          onSlInput={(e: any) =>
            onChange({ ...draft, comment: (e.target as any).value })
          }
        />
      </div>

      <div className={styles.actions}>
        <SlButton variant="success" type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Confirm"}
        </SlButton>
        <SlButton variant="danger" type="button" onClick={onCancel}>
          Cancel
        </SlButton>
      </div>
    </form>
  );
};
