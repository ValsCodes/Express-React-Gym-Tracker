import { useEffect, useState } from "react";
import { SortableItem } from "../../components";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createDragEndHandler } from "../../handlers/handleDragEnd";
import { SlButton, SlInput, SlMenu, SlMenuItem, SlDropdown } from "../../components/index.ts";

//TODO share style across components
import styles from "../Workout/styles/WorkoutOverview.module.scss";


interface MuscleGroup {
  id: number;
  name: string;
}

interface Exercise {
  id: number;
  name: string;
  muscleGroupId: number;
}

interface EditExercise {
  name?: string;
  muscleGroupId?: number;
}

interface CreateWorkout {
  name: string;
  muscleGroupId: number;
}

export const ExerciseOverview = () => {
  const [exercise, setExercise] = useState<Exercise[]>([]);
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);
    const [editDraft, setEditDraft] = useState<Partial<Omit<Exercise, 'id'>>>({
    name: "",
  })

    const [isCreating, setIsCreating] = useState(false);
    const [createDraft, setCreateDraft] = useState<{name: string, muscleGroupId: number}>({
    name: "",
    muscleGroupId: 0
  });


  const handleDragEnd = createDragEndHandler<Exercise>(setExercise);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    getExercise();
    getMuscleGroups();
  }, []);

  const getExercise = async () => {
    await fetch("http://localhost:3001/exercise")
      .then((res) => res.json())
      .then((data: Exercise[]) => setExercise(data))
      .catch(console.error);
  };

    const getMuscleGroups = async () => {
    await fetch("http://localhost:3001/muscle-group")
      .then((res) => res.json())
      .then((data: MuscleGroup[]) => setMuscleGroup(data))
      .catch(console.error);
  };

  const confirmCreate = async () => {
  if (!createDraft.name) return;

  const payload:CreateWorkout = {
    name: createDraft.name,
    muscleGroupId: createDraft.muscleGroupId
  };

  await fetch("http://localhost:3001/exercise", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).then(r => r.json());

  await getExercise();

  setIsCreating(false);
  setCreateDraft({ name: "", muscleGroupId: 0});
  };

  const confirmEdit = async () => {
    if (editingId == null) return;

    const data: EditExercise = {
      name: editDraft.name,
    };

    await fetch(`http://localhost:3001/exercise/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json());

    await getExercise();

    setEditingId(null);
    setEditDraft({});
  };

  const deleteExercise = async (id: number) => {
    try {
      await fetch(`http://localhost:3001/exercise/${id}`, {
        method: "DELETE",
      });
      await getExercise();
    } catch (e) {
      console.error("Failed to delete exercise", e);
    }
  };

  const startEdit = (item: Exercise) => {
    setEditingId(item.id);
    setEditDraft(item);
  };

  const cancelOperation = () => {
    setEditingId(null);
    setEditDraft({});
  };

  return (
    <div>
      <div className={styles.header}>
        <h1>Exercise Overview</h1>
        <SlButton variant="primary" onClick={() => setIsCreating(true)}>
          Add Exercise
        </SlButton>
      </div>

{isCreating && (
        <div className={styles.addItemRow}>
          <div className={styles.itemHeader}>
<SlInput
                          value={createDraft.name ?? ""}
                          placeholder="Exercise"
                          onKeyDown={(e) => e.stopPropagation()}
                          onSlInput={(e) => {
                            const val = (e.currentTarget as any).value as string;
                            setCreateDraft((d) => ({ ...d, name: val }));
                          }}
                        />
          </div>
          <div className={styles.actionButtons}>
            <SlButton variant="success" onClick={confirmCreate}>
              Confirm
            </SlButton>
            <SlButton
              variant="danger"
            
              onClick={() => {
                setIsCreating(false);
                setCreateDraft({ name: "", muscleGroupId: 0});
              }}
            >
              Cancel
            </SlButton>
          </div>
        </div>
      )}

      <DndContext
        collisionDetection={closestCenter}
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={exercise.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {exercise.map((item) => {
            const isEditing = item.id === editingId;
            return (
              <SortableItem key={item.id} id={item.id}>
                <div className={styles.itemRow}>
                  <div className={styles.itemHeader}>
                    {isEditing ? (
                      <>
                        <SlInput
                          value={editDraft.name ?? ""}
                          placeholder="Exercise"
                          onPointerDown={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                          onKeyUp={(e) => e.stopPropagation()}
                          onSlInput={(e) => {
                            const val = (e.currentTarget as any)
                              .value as string;
                            setEditDraft((d) => ({ ...d, name: val }));
                          }}
                        />

{/* TODO create dropdown with all muscle groups - muscleGroup */}
                        <SlDropdown>
    <SlButton slot="{editDraft.muscleGroupId}" caret>
      Muscle Group
    </SlButton>
    <SlMenu>
      <SlMenuItem>Dropdown Item 1</SlMenuItem>
      <SlMenuItem>Dropdown Item 2</SlMenuItem>
      <SlMenuItem>Dropdown Item 3</SlMenuItem>
      </SlMenu>
      </SlDropdown>
                        {}
                      </>
                    ) : (
                      <>
                        <p>{item.name}</p>
                        <p>{item.muscleGroupId}</p>
                      </>
                    )}
                  </div>

                  <div className={styles.actionButtons}>
                    {isEditing ? (
                      <>
                        <SlButton
                          variant="success"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={confirmEdit}
                        >
                          Confirm
                        </SlButton>
                        <SlButton
                          variant="danger"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={cancelOperation}
                        >
                          Cancel
                        </SlButton>
                      </>
                    ) : (
                      <>
                        <SlButton
                          variant="success"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={() => startEdit(item)}
                        >
                          Edit
                        </SlButton>
                        <SlButton
                          variant="danger"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={() => deleteExercise(item.id)}
                        >
                          Delete
                        </SlButton>
                      </>
                    )}
                  </div>
                </div>
              </SortableItem>
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
};
