import { useEffect, useState} from "react";
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
import {
  SlButton,
  SlInput,
  SlMenu,
  SlMenuItem,
  SlDropdown,
} from "../../components/index.ts";

import styles from "./ExerciseManager.module.scss";
import {Exercise, EditExercise, CreateExercise, MuscleGroup} from "../../types/index.ts"

export const ExerciseManager = () => {
  const [exercise, setExercise] = useState<Exercise[]>([]);
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Omit<Exercise, "id">>>({
    name: "",
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
      .then((data: MuscleGroup[]) => {
        // data.unshift({ id: 0, name: 'Mix' });
        setMuscleGroup(data);
      })
      .catch(console.error);    
  };

  const confirmCreate = async () => {
    
    console.log(createDraft);
    if (!createDraft.name && createDraft.muscleGroupId !== null && !muscleGroup.some((x) => x.id === createDraft.muscleGroupId))
      return;

    const payload: CreateExercise = {
      name: createDraft.name,
      muscleGroupId: createDraft.muscleGroupId,
    };

    await fetch("http://localhost:3001/exercise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((r) => r.json());

    await getExercise();

    setIsCreating(false);
    setCreateDraft({ name: "", muscleGroupId: null });
  };

  const confirmEdit = async () => {
    if (editingId == null) return;

    const data: EditExercise = {
      name: editDraft.name,
      muscleGroupId: editDraft.muscleGroupId,
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

  const [editLabel, setEditLabel] = useState<{
    name: string;
    muscleGroupId: number | null;
  }>({ name: "Muscle Group", muscleGroupId: null });

  const startEdit = (item: Exercise) => {
    setEditingId(item.id);
    setEditDraft(item);

    const label: string =
      muscleGroup.find((x) => x.id == item.muscleGroupId)?.name ?? "";
    setEditLabel({ name: label, muscleGroupId: item.muscleGroupId });
  };

  const handleSelectEdit = (event: CustomEvent) => {
    const id = event.detail.item.value as number;

    const label: string = muscleGroup.find((x) => x.id == id)?.name ?? "";
    setEditLabel({ name: label, muscleGroupId: id });

    setEditDraft((d) => ({ ...d, muscleGroupId: id }));
  };

  const cancelEditOperation = () => {
    setEditingId(null);
    setEditDraft({});
  };

  const [isCreating, setIsCreating] = useState(false);
  const [createDraft, setCreateDraft] = useState<{name: string; muscleGroupId: number | null;}>({
    name: "",
    muscleGroupId: muscleGroup.length > 0 ? muscleGroup[0].id : null,
  });

  const [createDropDownLabel, setCreateDropDownLabel] = useState<{
    name: string;
    muscleGroupId: number | null;
  }>({ name: "Muscle Group", muscleGroupId: null });

  const handleSelectCreate = (event: CustomEvent) => {
    const id = event.detail.item.value as number;

    const label: string = muscleGroup.find((x) => x.id == id)?.name ?? "";
    setCreateDropDownLabel({ name: label, muscleGroupId: id });
    setCreateDraft((d) => ({ ...d, muscleGroupId: id }));
  };

  const cancelCreateOperation = () => {
    setIsCreating(false);
    setCreateDraft({ name: "", muscleGroupId: null });
  };



  return (
    <div>
      <div className={styles.header}>
        <h1>Exercise Overview</h1> 
        <SlButton variant="primary" onClick={() => setIsCreating(true)}>
          Add Exercise
        </SlButton>
      </div>

      {/* <br />

      <SlInput  type="search"  placeholder="Search exercises…"/> */}

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
            <SlDropdown hoist>
              <SlButton
                slot="trigger"
                caret
                onPointerDown={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                onKeyUp={(e) => e.stopPropagation()}
              >
                {createDropDownLabel.name}
              </SlButton>

              <SlMenu
                onSlSelect={handleSelectCreate}
                onPointerDown={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                onKeyUp={(e) => e.stopPropagation()}
              >
                {muscleGroup.map((opt) => (
                  <SlMenuItem key={opt.id} value={opt.id!.toString()}>
                    {opt.name}
                  </SlMenuItem>
                ))}
              </SlMenu>
            </SlDropdown>
          </div>
          <div className={styles.actionButtons}>
            <SlButton variant="success" onClick={confirmCreate}>
              Confirm
            </SlButton>
            <SlButton
              variant="danger"
              onClick={() => {
                cancelCreateOperation();
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
                        {
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
                              {muscleGroup.map((opt) => (
                                <SlMenuItem
                                  key={opt.id}
                                  value={opt.id.toString()}
                                >
                                  {opt.name}
                                </SlMenuItem>
                              ))}
                            </SlMenu>
                          </SlDropdown>
                        }
                      </>
                    ) : (
                      <>
                        <p>{item.name}</p> |
                        <p>
                          Muscle Group:{" "}
                          {
                            muscleGroup.find((x) => x.id == item.muscleGroupId)
                              ?.name
                          }
                        </p>
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
                          onClick={cancelEditOperation}
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
