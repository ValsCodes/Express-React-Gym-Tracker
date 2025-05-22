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
  const [editLabelMuscleGroup, setEditLabelMuscleGroup] = useState<{    name: string;    muscleGroupId: number;  }>({ name: "Muscle Group", muscleGroupId: 0 });

  const [isCreating, setIsCreating] = useState(false);
  const [createDraft, setCreateDraft] = useState<Partial<Omit<WorkingSet, "id">>>({});
  const [createLabelExercise, setCreateLabelExercise] = useState<{name: string; exerciseId: number;}>({ name: "Exercise", exerciseId: 0 });
  const [createLabelMuscleGroup, setCreateLabelMuscleGroup] = useState<{name: string; muscleGroupId: number;}>({ name: "Muscle Group", muscleGroupId: 0 });

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
    const idNumber = Number(id);
      if (isNaN(idNumber) || idNumber <= 0) return;

      const payload: CreateWorkingSet = {
        workoutId: idNumber,
        comment: createDraft.comment,
        exerciseId: createDraft.exerciseId,
        weight: Number(createDraft.weight),
        repetitions: Number(createDraft.repetitions),
      };

    await fetch("http://localhost:3001/working-set", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(r => r.json());

    await getWorkingSetsForWorkout();

    setIsCreating(false);
    setCreateDraft({ });
  };

  const confirmEdit = async () => {
    if (editingId == null) return;

    const data: EditWorkingSet = {
      exerciseId: editDraft.exerciseId,
      weight: editDraft.weight,
      repetitions: editDraft.repetitions,
      comment: editDraft.comment,
    };

    await fetch(`http://localhost:3001/working-set/${editingId}`, {
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

  const handleSelectEditExercise = (event: CustomEvent) => {
    const id = event.detail.item.value as number;

    const label: string = exercises.find((x) => x.id == id)?.name ?? "";
    setEditLabelExercise({ name: label, exerciseId: id });

    setEditDraft((d) => ({ ...d, exerciseId: id }));
  };

    const handleSelectEditMuscleGroup = (event: CustomEvent) => {
    const id = event.detail.item.value as number;

    const label: string = muscleGroups.find((x) => x.id == id)?.name ?? "";
    setEditLabelMuscleGroup({ name: label, muscleGroupId: id });
  };

    const handleSelectCreateExercise = (event: CustomEvent) => {
    const id = event.detail.item.value as number;

    const label: string = exercises.find((x) => x.id == id)?.name ?? "";
    setCreateLabelExercise({ name: label, exerciseId: id });

    setCreateDraft((d) => ({ ...d, exerciseId: id }));
  };

      const handleSelectCreateMuscleGroup = (event: CustomEvent) => {
    const id = event.detail.item.value as number;

    const label: string = muscleGroups.find((x) => x.id == id)?.name ?? "";
    setCreateLabelMuscleGroup({ name: label, muscleGroupId: id });
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
                          value={createDraft.weight?.toString() ?? "0"}
                          placeholder="Weight"
                          type="number"
                          onPointerDown={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                          onKeyUp={(e) => e.stopPropagation()}
                          onSlInput={(e) => {
                            const val = (e.currentTarget as any)
                              .value as number;
                            setCreateDraft((d) => ({ ...d, weight: val }));
                          }}
                        />
                        <p>Repetitions</p>
                        <SlInput
                          className={styles.numberInput}
                          value={createDraft.repetitions?.toString() ?? "0"}
                          placeholder="Repetitions"
                          type="number"
                          onPointerDown={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                          onKeyUp={(e) => e.stopPropagation()}
                          onSlInput={(e) => {
                            const val = (e.currentTarget as any)
                              .value as number;
                            setCreateDraft((d) => ({ ...d, repetitions: val }));
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
                            {createLabelExercise.name}
                          </SlButton>

                          <SlMenu
                            onSlSelect={handleSelectCreateExercise}
                            onPointerDown={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            onKeyUp={(e) => e.stopPropagation()}
                          >
                            {exercises.map((opt) => (
                              <SlMenuItem key={opt.id} value={opt.id.toString()}>
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
                            {createLabelMuscleGroup.name}
                          </SlButton>

                          <SlMenu
                            onSlSelect={handleSelectCreateMuscleGroup}
                            onPointerDown={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            onKeyUp={(e) => e.stopPropagation()}
                          >
                            {muscleGroups.map((opt) => (<SlMenuItem key={opt.id} value={opt.id.toString()}
                              >
                                {opt.name}
                              </SlMenuItem>
                            ))}
                          </SlMenu>
                        </SlDropdown>

                        <SlInput
                          value={createDraft.comment?.toString() ?? ""}
                          placeholder="Comment"
                          onPointerDown={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                          onKeyUp={(e) => e.stopPropagation()}
                          onSlInput={(e) => {
                            const val = (e.currentTarget as any)
                              .value as string;
                            setCreateDraft((d) => ({ ...d, comment: val }));
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
                setCreateDraft({ comment: "" });
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
                            {editLabelExercise.name}
                          </SlButton>

                          <SlMenu
                            onSlSelect={handleSelectEditExercise}
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
                            {editLabelMuscleGroup.name}
                          </SlButton>

                          <SlMenu
                            onSlSelect={handleSelectEditMuscleGroup}
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
                          onKeyDown={(e) => e.stopPropagation()}
                          onKeyUp={(e) => e.stopPropagation()}
                          onClick={confirmEdit}
                        >
                          Confirm
                        </SlButton>
                        <SlButton
                          variant="danger"
                          onKeyDown={(e) => e.stopPropagation()}
                          onKeyUp={(e) => e.stopPropagation()}
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
                          onKeyDown={(e) => e.stopPropagation()}
                          onKeyUp={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={() => startEdit(item)}
                        >
                          Edit
                        </SlButton>
                        <SlButton
                        onKeyDown={(e) => e.stopPropagation()}
                          onKeyUp={(e) => e.stopPropagation()}
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
