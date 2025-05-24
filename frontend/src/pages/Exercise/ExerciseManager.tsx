import { useCallback, useEffect, useState } from "react";
import { SortableItem } from "../../components/index.ts";
import {  DndContext,  closestCenter,  PointerSensor,  useSensor,  useSensors,} from "@dnd-kit/core";
import {  SortableContext,  verticalListSortingStrategy,} from "@dnd-kit/sortable";
import { createDragEndHandler } from "../../handlers/handleDragEnd.ts";
import {  SlButton,  SlInput,  SlMenu,  SlMenuItem,  SlDropdown,} from "../../components/index.ts";
import {  Exercise,  EditExercise,  CreateExercise,  MuscleGroup,} from "../../types/index.ts";
import {  fetchExercises,  deleteExercise,  updateExercise,  createExercise,} from "../../services/exerciseService.ts";
import { fetchMuscleGroups } from "../../services/muscleGroupService.ts";

import "./ExerciseManager.module.scss";

export const ExerciseManager = () => {
  const [exercise, setExercise] = useState<Exercise[]>([]);
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Omit<Exercise, "id">>>({name: ""});

    const [isCreating, setIsCreating] = useState(false);
  const [createDraft, setCreateDraft] = useState<{name: string; muscleGroupId: number | null;}>({ name: "", muscleGroupId: muscleGroup.length > 0 ? muscleGroup[0].id : null});

  const [createDropDownLabel, setCreateDropDownLabel] = useState<{    name: string;    muscleGroupId: number | null;  }>({ name: "Muscle Group", muscleGroupId: null });

  const [editLabel, setEditLabel] = useState<{    name: string;    muscleGroupId: number | null;  }>({ name: "Muscle Group", muscleGroupId: 0 });

  const handleDragEnd = createDragEndHandler<Exercise>(setExercise);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    getExercise();
    getMuscleGroups();
  }, []);

  const getExercise = useCallback(async () => {
    try {
      const data = await fetchExercises();
      const normalized = data.map((ex) => ({...ex,muscleGroupId: ex.muscleGroupId ?? 0}));
      setExercise([...normalized].sort((a, b) => b.muscleGroupId - a.muscleGroupId));
    } catch (err) {
      console.error("Failed to load working sets", err);
    }
  }, []);

  const getMuscleGroups = useCallback(async () => {
    try {
      const data = await fetchMuscleGroups();
      data.unshift({ id: 0, name: "No Muscle Group" });
      setMuscleGroup(data);
    } catch (err) {
      console.error("Failed to load Muscle Groups", err);
    }
  }, []);

  const confirmCreate = async () => {
    console.log(createDraft);
    if (
      !createDraft.name &&
      createDraft.muscleGroupId !== null &&
      !muscleGroup.some((x) => x.id === createDraft.muscleGroupId)
    )
      return;

    const payload: CreateExercise = {
      name: createDraft.name,
      muscleGroupId:
        createDraft.muscleGroupId == 0 ? null : createDraft.muscleGroupId,
    };

    await createExercise(payload);

    await getExercise();

    setIsCreating(false);
     setCreateDraft({ name: "", muscleGroupId: createDraft.muscleGroupId });
  };

  const confirmEdit = async () => {
    if (editingId == null) return;

    const data: EditExercise = {
      name: editDraft.name,
      muscleGroupId:
        editDraft.muscleGroupId == 0 ? null : editDraft.muscleGroupId,
    };

    console.log(data);

    await updateExercise(editingId, data);
    await getExercise();

    setEditingId(null);
    setEditDraft({});
  };

  const deleteEx = async (id: number) => {
    try {
      await deleteExercise(id);

      await getExercise();
    } catch (e) {
      console.error("Failed to delete exercise", e);
    }
  };

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
      <div className="page-header">
        <h1>Exercises</h1>
        <div className="action-buttons">
        <SlButton variant="primary" onClick={() => setIsCreating(true)}>
          Add
        </SlButton>
        </div>
      </div>

      {/* <br />

      <SlInput  type="search"  placeholder="Search exercises…"/> */}

      {isCreating && (
        <div className="add-item-row">
          <div className="item-header">
            <SlInput
              value={createDraft.name ?? ""}
              maxlength={20}
              className="text-input"
              placeholder="Exercise"
              onKeyDown={(e) => e.stopPropagation()}
              onKeyUp={(e) => e.stopPropagation()}
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
          <div className="action-buttons">
            <SlButton variant="success" onClick={confirmCreate}>
              Confirm
            </SlButton>
            <SlButton
              variant="danger"
              onPointerDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              onKeyUp={(e) => e.stopPropagation()}
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
                <div className="dnd-item-row">
                  <div className="dnd-item-header">
                    {isEditing ? (
                      <>
                        <SlInput
                          value={editDraft.name ?? ""}
                          placeholder="Exercise"
                          className="text-input"
                          maxlength={20}
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
                                  value={opt.id?.toString()}
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

                  <div className="action-buttons">
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
                          onPointerDown={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                          onKeyUp={(e) => e.stopPropagation()}
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
                          onKeyDown={(e) => e.stopPropagation()}
                          onKeyUp={(e) => e.stopPropagation()}
                          onClick={() => startEdit(item)}
                        >
                          Edit
                        </SlButton>
                        <SlButton
                          variant="danger"
                          onPointerDown={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                          onKeyUp={(e) => e.stopPropagation()}
                          onClick={() => deleteEx(item.id)}
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
