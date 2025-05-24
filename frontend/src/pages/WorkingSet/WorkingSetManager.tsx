import { useCallback, useEffect, useState } from "react";
import { SortableItem } from "../../components/index.ts";
import {  DndContext,  closestCenter,  PointerSensor,  useSensor,  useSensors,} from "@dnd-kit/core";
import {  SortableContext,  verticalListSortingStrategy,} from "@dnd-kit/sortable";
import { createDragEndHandler } from "../../handlers/handleDragEnd.ts";
import { useNavigate, useParams } from "react-router-dom";
import {  SlButton,  SlInput,  SlMenu,  SlMenuItem,  SlDropdown,} from "../../components/index.ts";
import {  WorkingSet,  EditWorkingSet,  CreateWorkingSet,  Exercise,  MuscleGroup,} from "../../types/index.ts";
import {  fetchWorkingSets,  createWorkingSet,  updateWorkingSet,  deleteWorkingSet,} from "../../services/workingSetService.ts";
import { fetchExercises } from "../../services/exerciseService.ts";
import { fetchMuscleGroups } from "../../services/muscleGroupService.ts";

import "./WorkingSetManager.module.scss";

export const WorkingSetManager = () => {
  const { id: workoutId } = useParams();
  const sensors = useSensors(useSensor(PointerSensor));
  const navigate = useNavigate();

  const [workingSet, setWorkingSets] = useState<WorkingSet[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);

  const handleDragEnd = createDragEndHandler<WorkingSet>(setWorkingSets);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Omit<WorkingSet, "id">>>({});
  const [editLabelExercise, setEditLabelExercise] = useState<{    name: string;    exerciseId: number;  }>({ name: "Exercise", exerciseId: 0 });
  const [editExercise, setEditExercise] = useState<Exercise[]>([]);
  const [editLabelMuscleGroup, setEditLabelMuscleGroup] = useState<{    name: string;    muscleGroupId: number;  }>({ name: "Muscle Group", muscleGroupId: 0 });

  const [isCreating, setIsCreating] = useState(false);
  const [createDraft, setCreateDraft] = useState<Partial<Omit<WorkingSet, "id">>  >({});
  const [createLabelExercise, setCreateLabelExercise] = useState<{    name: string;    exerciseId: number;  }>({ name: "Exercise", exerciseId: 0 });
  const [createExercise, setCreateExercise] = useState<Exercise[]>([]);
  const [createLabelMuscleGroup, setCreateLabelMuscleGroup] = useState<{    name: string;    muscleGroupId: number;  }>({ name: "Muscle Group", muscleGroupId: 0 });


  useEffect(() => {
    loadSets();
    loadExercise();
    loadMuscleGroups();
  }, []);

  const loadSets = useCallback(async () => {
    try {
      const data = await fetchWorkingSets(Number(workoutId));
      setWorkingSets(data.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error("Failed to load working sets", err);
    }
  }, [workoutId]);

  const loadExercise = useCallback(async () => {
    try {
      const data = await fetchExercises();
      setExercises(data);
    } catch (err) {
      console.error("Failed to load working sets", err);
    }
  }, []);

  const loadMuscleGroups = useCallback(async () => {
    try {
      const data = await fetchMuscleGroups();
      setMuscleGroups(data);
    } catch (err) {
      console.error("Failed to load working sets", err);
    }
  }, []);

  const confirmCreate = async () => {
    const idNumber = Number(workoutId);
    if (isNaN(idNumber) || idNumber <= 0) return;

    const payload: CreateWorkingSet = {
      workoutId: idNumber,
      comment: createDraft.comment,
      exerciseId: createDraft.exerciseId,
      weight: Number(createDraft.weight),
      repetitions: Number(createDraft.repetitions),
    };

    try {
      await createWorkingSet(payload);
      await loadSets();

      setIsCreating(false);
       setCreateDraft({repetitions: createDraft.repetitions, weight: createDraft.weight, exerciseId: createDraft.exerciseId});
    } catch (error) {
      console.error("Failed to create working set:", error);
    }
  };

  const confirmEdit = async () => {
    if (editingId == null) return;

    const data: EditWorkingSet = {
      exerciseId: editDraft.exerciseId,
      weight: editDraft.weight,
      repetitions: editDraft.repetitions,
      comment: editDraft.comment,
    };

    await updateWorkingSet(editingId, data);
    await loadSets();

    setEditingId(null);
    setEditDraft({});
  };

  const deleteSet = async (id: number) => {
    try {
      await deleteWorkingSet(id);
      await loadSets();
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
    const exerciseId = parseInt(event.detail.item.value, 10);
    const name = exercises.find((x) => x.id === exerciseId)?.name ?? "Exercise";
    setEditLabelExercise({ name, exerciseId });
    setEditDraft((d) => ({ ...d, exerciseId }));
  };

  const handleSelectEditMuscleGroup = (event: CustomEvent) => {
    const muscleGroupId = parseInt(event.detail.item.value, 10);
    const name =
      muscleGroups.find((x) => x.id === muscleGroupId)?.name ?? "Muscle Group";

    setEditLabelMuscleGroup({ name, muscleGroupId });

    const filtered = exercises.filter(
      (ex) => ex.muscleGroupId === muscleGroupId
    );
    setEditExercise(filtered);

    setEditLabelExercise({ name: "Exercise", exerciseId: 0 });
    setEditDraft((d) => ({ ...d, exerciseId: undefined }));
  };

  const handleSelectCreateExercise = (event: CustomEvent) => {
    const exerciseId = parseInt(event.detail.item.value, 10);
    const name = exercises.find((x) => x.id === exerciseId)?.name ?? "Exercise";
    setCreateLabelExercise({ name, exerciseId });
    setCreateDraft((d) => ({ ...d, exerciseId }));
  };

  const handleSelectCreateMuscleGroup = (event: CustomEvent) => {
    const muscleGroupId = parseInt(event.detail.item.value, 10);
    const name =
      muscleGroups.find((x) => x.id === muscleGroupId)?.name ?? "Muscle Group";

    setCreateLabelMuscleGroup({ name, muscleGroupId });

    const filtered = exercises.filter(
      (ex) => ex.muscleGroupId === muscleGroupId
    );
    setCreateExercise(filtered);

    setCreateLabelExercise({ name: "Exercise", exerciseId: 0 });
    setCreateDraft((d) => ({ ...d, exerciseId: undefined }));
  };

  return (
    <div>
      <div className="page-header" style={{ minWidth: "37.5rem" }}>
        <h1>Sets </h1>
        <div className="action-buttons">
        <SlButton variant="primary" onClick={() => setIsCreating(true)}>
          Add
        </SlButton>
        <SlButton variant="primary" onClick={() => navigate("/workout")}>
          Back
        </SlButton>
        </div>
      </div>

      {isCreating && (
        <div className="add-item-row">
          <div className="item-header">
            {
              <>
                <p>Weight</p>
                <SlInput
                  className="number-input"
                  value={createDraft.weight?.toString() ?? "0"}
                  placeholder="kg"
                  min={0}
                  max={1000}
                  type="number"
                  onPointerDown={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  onKeyUp={(e) => e.stopPropagation()}
                  onSlInput={(e) => {
                    const val = (e.currentTarget as any).value as number;
                    setCreateDraft((d) => ({ ...d, weight: val }));
                  }}
                />
                <p>Repetitions</p>
                <SlInput
                  className="number-input"
                  value={createDraft.repetitions?.toString() ?? "0"}
                  placeholder="reps"
                  min={0}
                  max={150}
                  type="number"
                  onPointerDown={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  onKeyUp={(e) => e.stopPropagation()}
                  onSlInput={(e) => {
                    const val = (e.currentTarget as any).value as number;
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
                    {createExercise.map((opt) => (
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
                    {muscleGroups.map((opt) => (
                      <SlMenuItem key={opt.id} value={opt.id.toString()}>
                        {opt.name}
                      </SlMenuItem>
                    ))}
                  </SlMenu>
                </SlDropdown>

                <SlInput
                  value={createDraft.comment?.toString() ?? ""}
                  placeholder="Comment"
                  maxlength={20}
                  onPointerDown={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  onKeyUp={(e) => e.stopPropagation()}
                  onSlInput={(e) => {
                    const val = (e.currentTarget as any).value as string;
                    setCreateDraft((d) => ({ ...d, comment: val }));
                  }}
                />
              </>
            }
          </div>
          <div className="action-buttons">
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
                <div className="dnd-item-row" style={{ minWidth: "37.5rem" }}>
                  <div className="dnd-item-header">
                    {isEditing ? (
                      <>
                        <p>Weight</p>
                        <SlInput
                          className="number-input"
                          value={editDraft.weight?.toString() ?? "0"}
                          placeholder="kg"
                          min={0}
                          max={1000}
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
                          className="number-input"
                          value={editDraft.repetitions?.toString() ?? "0"}
                          placeholder="reps"
                          type="number"
                          min={0}
                          max={150}
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
                            {editExercise.map((opt) => (
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
                          maxlength={20}
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
                        {item.exerciseId != 0 && item.exerciseId != null  && <p> {exercises.find((x) => x.id === item.exerciseId)?.name}  | </p> }
                        {item.weight != null && item.weight != 0  && <p>Weight: {item.weight} kg</p>}
                        {item.repetitions != null && item.repetitions != 0 && <p>Reps: {item.repetitions} </p>}
                        {item.comment !== null && <p>Comment: {item.comment} </p>}
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
                          onClick={() => deleteSet(item.id)}
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
