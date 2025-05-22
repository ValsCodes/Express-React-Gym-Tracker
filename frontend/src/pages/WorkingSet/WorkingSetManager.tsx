import { useEffect, useState } from "react";
import { SortableItem } from "../../components/index.ts";
import {  DndContext,  closestCenter,  PointerSensor,  useSensor,  useSensors,} from "@dnd-kit/core";
import {  SortableContext,  verticalListSortingStrategy,} from "@dnd-kit/sortable";
import { createDragEndHandler } from "../../handlers/handleDragEnd.ts";
import { useNavigate, useParams } from "react-router-dom";
import { SlButton,  SlInput,  SlMenu,  SlMenuItem,  SlDropdown,} from "../../components/index.ts";
import styles from "./WorkingSetManager.module.scss";
import {WorkingSet, EditWorkingSet, CreateWorkingSet, Exercise, MuscleGroup} from "../../types/index.ts"


export const WorkingSetManager = () => {

  const { id } = useParams();
  const sensors = useSensors(useSensor(PointerSensor));

  const [workingSet, setWorkingSet] = useState<WorkingSet[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);

  const handleDragEnd = createDragEndHandler<WorkingSet>(setWorkingSet);

  

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Omit<WorkingSet, "id">>>({});
  const [editLabel, setEditLabel] = useState<{    name: string;    exerciseId: number;  }>({ name: "Exercise", exerciseId: 0 });
  const [editLabelExercise, setEditLabelExercise] = useState<{    name: string;    exerciseId: number;  }>({ name: "Exercise", exerciseId: 0 });
  const [editLabelMuscleGroup, setEditLabelMuscleGroup] = useState<{    name: string;    exerciseId: number;  }>({ name: "Exercise", exerciseId: 0 });

  const [isCreating, setIsCreating] = useState(false);
  const [createDraft, setCreateDraft] = useState<{}>({});
  const [createLabelExercise, setCreateLabelExercise] = useState<{    name: string;    exerciseId: number;  }>({ name: "Exercise", exerciseId: 0 });
  const [createLabelMuscleGroup, setCreateLabelMuscleGroup] = useState<{    name: string;    exerciseId: number;  }>({ name: "Exercise", exerciseId: 0 });

  useEffect(() => {
    getWorkingSetsForWorkout();
    getExercise();
    getMuscleGroups();
  }, []);

  const getWorkingSetsForWorkout = async () => {
    await fetch(`http://localhost:3001/workout/${id}/working-sets`)
      .then((res) => res.json())
      .then((data: WorkingSet[]) => setWorkingSet(data))
      .catch(console.error);
  };

    const getExercise = async () => {
      await fetch(`http://localhost:3001/exercise`)
        .then((res) => res.json())
        .then((data: Exercise[]) => setExercises(data))
        .catch(console.error);
    };

        const getMuscleGroups = async () => {
      await fetch(`http://localhost:3001/muscle-group`)
        .then((res) => res.json())
        .then((data: MuscleGroup[]) => setMuscleGroups(data))
        .catch(console.error);
    };

  const confirmCreate = async () => {
    //   if (!createDraft.description) return;

    //   const payload:CreateWorkingSet= {
    //  };

    // await fetch("http://localhost:3001/workout", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload)
    // }).then(r => r.json());

    await getWorkingSetsForWorkout();

    setIsCreating(false);
    setCreateDraft({ description: "" });
  };

  const confirmEdit = async () => {
    if (editingId == null) return;

    const data: EditWorkingSet = {
      exerciseId: editDraft.exerciseId,
    };

    await fetch(`http://localhost:3001/workout/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json());

    await getWorkingSetsForWorkout();

    setEditingId(null);
    setEditDraft({});
  };

  const deleteWorkout = async (id: number) => {
    try {
      await fetch(`http://localhost:3001/working-set/${id}`, {
        method: "DELETE",
      });
      await getWorkingSetsForWorkout();
    } catch (e) {
      console.error("Failed to delete working set", e);
    }
  };

  const startEdit = (item: WorkingSet) => {
    setEditingId(item.id);
    setEditDraft(item);
  };

  const cancelOperation = () => {
    setEditingId(null);
    setEditDraft({});
  };

  const handleSelectEdit = (event: CustomEvent) => {
    const id = event.detail.item.value as number;

    const label: string = exercises.find((x) => x.id == id)?.name ?? "";
    setEditLabel({ name: label, exerciseId: id });

    setEditDraft((d) => ({ ...d, exerciseId: id }));
  };

  return (
    <div>
      <div className={styles.header}>
        <h1>Working Sets </h1>
        <SlButton variant="primary" onClick={() => setIsCreating(true)}>
          Add Set
        </SlButton>
      </div>

      {isCreating && (
        <div className={styles.addItemRow}>
          <div className={styles.itemHeader}>
            {<>
                        <p>Weight</p>
                        <SlInput
                          className={styles.numberInput}
                          value={editDraft.weight?.toString() ?? "0"}
                          placeholder="Weight"
                          type="number"
                          onPointerDown={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                          onKeyUp={(e) => e.stopPropagation()}
                          onSlInput={(e) => {
                            const val = (e.currentTarget as any)
                              .value as number;
                            setEditDraft((d) => ({ ...d, weight: val }));
                          }}
                        />
                        <p>Repetitions</p>
                        <SlInput
                          className={styles.numberInput}
                          value={editDraft.repetitions?.toString() ?? "0"}
                          placeholder="Repetitions"
                          type="number"
                          onPointerDown={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                          onKeyUp={(e) => e.stopPropagation()}
                          onSlInput={(e) => {
                            const val = (e.currentTarget as any)
                              .value as number;
                            setEditDraft((d) => ({ ...d, repetitions: val }));
                          }}
                        />

                        <SlDropdown hoist>
                          <SlButton
                            slot="trigger"
                            caret
                            onPointerDown={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            onKeyUp={(e) => e.stopPropagation()}
                          >
                            {editLabel.name}
                          </SlButton>

                          <SlMenu
                            onSlSelect={handleSelectEdit}
                            onPointerDown={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            onKeyUp={(e) => e.stopPropagation()}
                          >
                            {exercises.map((opt) => (
                              <SlMenuItem
                                key={opt.id}
                                value={opt.id.toString()}
                              >
                                {opt.name}
                              </SlMenuItem>
                            ))}
                          </SlMenu>
                        </SlDropdown>
                        <SlDropdown hoist>
                          <SlButton
                            slot="trigger"
                            caret
                            onPointerDown={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            onKeyUp={(e) => e.stopPropagation()}
                          >
                            {editLabel.name}
                          </SlButton>

                          <SlMenu
                            onSlSelect={handleSelectEdit}
                            onPointerDown={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            onKeyUp={(e) => e.stopPropagation()}
                          >
                            {muscleGroups.map((opt) => (
                              <SlMenuItem
                                key={opt.id}
                                value={opt.id.toString()}
                              >
                                {opt.name}
                              </SlMenuItem>
                            ))}
                          </SlMenu>
                        </SlDropdown>

                        <SlInput
                          value={editDraft.comment?.toString() ?? ""}
                          placeholder="Comment"
                          onPointerDown={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                          onKeyUp={(e) => e.stopPropagation()}
                          onSlInput={(e) => {
                            const val = (e.currentTarget as any)
                              .value as string;
                            setEditDraft((d) => ({ ...d, comment: val }));
                          }}
                        />
                      </>}
          </div>
          <div className={styles.actionButtons}>
            <SlButton variant="success" onClick={confirmCreate}>
              Confirm
            </SlButton>
            <SlButton
              variant="danger"
              onClick={() => {
                setIsCreating(false);
                setCreateDraft({ description: "" });
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
          items={workingSet.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {workingSet.map((item) => {
            const isEditing = item.id === editingId;
            return (
              <SortableItem key={item.id} id={item.id}>
                <div className={styles.itemRow}>
                  <div className={styles.itemHeader}>
                    {isEditing ? (
                      <>
                        <p>Weight</p>
                        <SlInput
                          className={styles.numberInput}
                          value={editDraft.weight?.toString() ?? "0"}
                          placeholder="Weight"
                          type="number"
                          onPointerDown={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                          onKeyUp={(e) => e.stopPropagation()}
                          onSlInput={(e) => {
                            const val = (e.currentTarget as any)
                              .value as number;
                            setEditDraft((d) => ({ ...d, weight: val }));
                          }}
                        />
                        <p>Repetitions</p>
                        <SlInput
                          className={styles.numberInput}
                          value={editDraft.repetitions?.toString() ?? "0"}
                          placeholder="Repetitions"
                          type="number"
                          onPointerDown={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                          onKeyUp={(e) => e.stopPropagation()}
                          onSlInput={(e) => {
                            const val = (e.currentTarget as any)
                              .value as number;
                            setEditDraft((d) => ({ ...d, repetitions: val }));
                          }}
                        />

                        <SlDropdown hoist>
                          <SlButton
                            slot="trigger"
                            caret
                            onPointerDown={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            onKeyUp={(e) => e.stopPropagation()}
                          >
                            {editLabel.name}
                          </SlButton>

                          <SlMenu
                            onSlSelect={handleSelectEdit}
                            onPointerDown={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            onKeyUp={(e) => e.stopPropagation()}
                          >
                            {exercises.map((opt) => (
                              <SlMenuItem
                                key={opt.id}
                                value={opt.id.toString()}
                              >
                                {opt.name}
                              </SlMenuItem>
                            ))}
                          </SlMenu>
                        </SlDropdown>
                        <SlDropdown hoist>
                          <SlButton
                            slot="trigger"
                            caret
                            onPointerDown={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            onKeyUp={(e) => e.stopPropagation()}
                          >
                            {editLabel.name}
                          </SlButton>

                          <SlMenu
                            onSlSelect={handleSelectEdit}
                            onPointerDown={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            onKeyUp={(e) => e.stopPropagation()}
                          >
                            {exercises.map((opt) => (
                              <SlMenuItem
                                key={opt.id}
                                value={opt.id.toString()}
                              >
                                {opt.name}
                              </SlMenuItem>
                            ))}
                          </SlMenu>
                        </SlDropdown>

                        <SlInput
                          value={editDraft.comment?.toString() ?? ""}
                          placeholder="Comment"
                          onPointerDown={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                          onKeyUp={(e) => e.stopPropagation()}
                          onSlInput={(e) => {
                            const val = (e.currentTarget as any)
                              .value as string;
                            setEditDraft((d) => ({ ...d, comment: val }));
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <p>
                          {exercises.find((x) => x.id === item.exerciseId)
                            ?.name ?? "No Name"}
                        </p>
                        <p>Weight: {item.weight}</p>
                        <p>Reps: {item.repetitions}</p>
                        <p>Comment: {item.comment}</p>
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
