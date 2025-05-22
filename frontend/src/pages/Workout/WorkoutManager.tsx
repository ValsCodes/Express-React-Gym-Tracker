import { useEffect, useState } from "react";
import { SortableItem } from "../../components/index.ts";
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
import { createDragEndHandler } from "../../handlers/handleDragEnd.ts";
import { useNavigate } from "react-router-dom";
import { SlButton, SlInput } from "../../components/index.ts";
import styles from "./WorkoutManager.module.scss";
import {Workout, EditWorkout, CreateWorkout} from "../../types/index.ts"



export const WorkoutManager= () => {
  const [workout, setWorkout] = useState<Workout[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);
    const [editDraft, setEditDraft] = useState<Partial<Omit<Workout, 'id' | 'dateAdded'>>>({
    description: "",
  })

    const [isCreating, setIsCreating] = useState(false);
    const [createDraft, setCreateDraft] = useState<{description: string}>({
    description: ""
  });

  const handleDragEnd = createDragEndHandler<Workout>(setWorkout);
  const sensors = useSensors(useSensor(PointerSensor));
  const navigate = useNavigate();


  useEffect(() => {
    getWorkouts();
  }, []);

  const getWorkouts = async () => {
    await fetch("http://localhost:3001/workout")
      .then((res) => res.json())
      .then((data: Workout[]) => setWorkout(data))
      .catch(console.error);
  };

  const confirmCreate = async () => {
  if (!createDraft.description) return;

  const payload:CreateWorkout = {
    description: createDraft.description
  };

  await fetch("http://localhost:3001/workout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).then(r => r.json());

  await getWorkouts();

  setIsCreating(false);
  setCreateDraft({ description: ""});
  };

  const confirmEdit = async () => {
    if (editingId == null) return;

    const data: EditWorkout = {
      description: editDraft.description,
    };

    await fetch(`http://localhost:3001/workout/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json());

    await getWorkouts();

    setEditingId(null);
    setEditDraft({});
  };

  const deleteWorkout = async (id: number) => {
    try {
      await fetch(`http://localhost:3001/workout/${id}`, {
        method: "DELETE",
      });
      await getWorkouts();
    } catch (e) {
      console.error("Failed to delete workout", e);
    }
  };

  const startEdit = (item: Workout) => {
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
        <h1>Workouts Overview</h1>
        <SlButton variant="primary" onClick={() => setIsCreating(true)}>
          Add Workout
        </SlButton>
        {/* <SlButton variant="success" onClick={async () => await getWorkouts()}>
          Refresh
        </SlButton> */}
      </div>

{isCreating && (
        <div className={styles.addItemRow}>
          <div className={styles.itemHeader}>
<SlInput
                          value={createDraft.description ?? ""}
                          placeholder="Description"
                          onKeyDown={(e) => e.stopPropagation()}
                          onSlInput={(e) => {
                            const val = (e.currentTarget as any)
                              .value as string;
                            setCreateDraft((d) => ({ ...d, description: val }));
                          }}
                        />                     
            <SlInput
              type="date"
              value={createDraft.description}
              onSlInput={e =>
                setCreateDraft(d => ({ ...d, dateAdded: e.detail.value }))
              }
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
                setCreateDraft({ description: ""});
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
          items={workout.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {workout.map((item) => {
            const isEditing = item.id === editingId;
            return (
              <SortableItem key={item.id} id={item.id}
              onDoubleClick={() => navigate(`/workout/${item.id}/working-set`)}>
                <div className={styles.itemRow}>
                  <div className={styles.itemHeader}>
                    {isEditing ? (
                      <>
                        <SlInput
                          value={editDraft.description ?? ""}
                          placeholder="Description"
                          onPointerDown={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                          onKeyUp={(e) => e.stopPropagation()}
                          onSlInput={(e) => {
                            const val = (e.currentTarget as any)
                              .value as string;
                            setEditDraft((d) => ({ ...d, description: val }));
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <p>{item.description}</p>
                        <p>{new Date(item.dateAdded).toLocaleDateString()}</p>
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
                          onClick={() => deleteWorkout(item.id)}
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
