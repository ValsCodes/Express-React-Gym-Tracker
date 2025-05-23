import { useCallback, useEffect, useState } from "react";
import { SortableItem } from "../../components/index.ts";
import {  DndContext,  closestCenter,  PointerSensor,  useSensor,  useSensors,} from "@dnd-kit/core";
import {  SortableContext,  verticalListSortingStrategy,} from "@dnd-kit/sortable";
import { createDragEndHandler } from "../../handlers/handleDragEnd.ts";
import { useNavigate } from "react-router-dom";
import { SlButton, SlInput } from "../../components/index.ts";
import {Workout, EditWorkout, CreateWorkout} from "../../types/index.ts"
import {fetchWorkouts, updateWorkout, createWorkout, deleteWorkout} from "../../services/workoutService.ts"

import "./WorkoutManager.module.scss";

export const WorkoutManager= () => {
  const [workout, setWorkout] = useState<Workout[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Omit<Workout, 'id' | 'dateAdded'>>>({    description: "",  })

  const [isCreating, setIsCreating] = useState(false);
  const [createDraft, setCreateDraft] = useState<{description: string}>({    description: ""  });

  const handleDragEnd = createDragEndHandler<Workout>(setWorkout);
  const sensors = useSensors(useSensor(PointerSensor));
  const navigate = useNavigate();


  const getWorkouts = useCallback(async () => {
    try {
      const data = await fetchWorkouts();

      setWorkout(data);
    } catch (err) {
      console.error("Failed to load workouts", err);
    }
  }, []);

useEffect(() => {  
  getWorkouts();}, []);


    const confirmCreate = async () => {
      if (!createDraft.description) return;

      const payload: CreateWorkout = {
        description: createDraft.description,
      };

      await createWorkout(payload);
      await getWorkouts();

      setIsCreating(false);
      setCreateDraft({ description: "" });
    };

  const confirmEdit = async () => {
    if (editingId == null) return;

    const data: EditWorkout = {
      description: editDraft.description,
    };

    await updateWorkout(editingId, data);
    await getWorkouts();

    setEditingId(null);
    setEditDraft({});
  };

  const confirmDelete = async (id: number) => {
    try {
      await deleteWorkout(id)
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
      <div className="page-header">
        <h1>Workouts</h1>
        <SlButton variant="primary" onClick={() => setIsCreating(true)}>
          Add Workout
        </SlButton>
        {/* <SlButton variant="success" onClick={async () => await getWorkouts()}>
          Refresh
        </SlButton> */}
      </div>

{isCreating && (
        <div className="add-item-row">
          <div className="item-header">
<SlInput
                          value={createDraft.description ?? ""}
                          placeholder="Description"
                          maxlength={20}
                          onKeyDown={(e) => e.stopPropagation()}
                          onSlInput={(e) => {
                            const val = (e.currentTarget as any)
                              .value as string;
                            setCreateDraft((d) => ({ ...d, description: val }));
                          }}
                        />
          </div>
          <div className="action-buttons">
            <SlButton variant="success" onClick={confirmCreate}>
              Confirm
            </SlButton>
            <SlButton
              variant="danger"
              onClick={() => {
                setIsCreating(false);
                setCreateDraft({ description: ""});
              }}>Cancel            </SlButton>
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
                <div className="dnd-item-row">
                  <div className="dnd-item-header">
                    {isEditing ? (
                      <>
                        <SlInput
                          value={editDraft.description ?? ""}
                          maxlength={20}
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
                        <p>{item.description} - {new Date(item.dateAdded).toLocaleDateString()}</p>
                      </>
                    )}
                  </div>

                  <div className="action-buttons">
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
                          onClick={() => confirmDelete(item.id)}
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
