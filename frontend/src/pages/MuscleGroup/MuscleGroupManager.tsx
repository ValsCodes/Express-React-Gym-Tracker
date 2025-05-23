import { useCallback, useEffect, useState } from "react";
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
import { SlButton, SlInput } from "../../components/index.ts";
import styles from "./MuscleGroupManager.module.scss";
import {MuscleGroup, CreateMuscleGroup, EditMuscleGroup} from "../../types/index.ts"

import {fetchMuscleGroups, updateMuscleGroup, createMuscleGroup, deleteMuscleGroup} from "../../services/muscleGroupService.ts"


export const MuscleGroupManager = () => { 
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Omit<MuscleGroup, "id">>>({
    name: "",
  });

  const [isCreating, setIsCreating] = useState(false);
  const [createDraft, setCreateDraft] = useState<{ name: string }>({
    name: "",
  });

  const handleDragEnd = createDragEndHandler<MuscleGroup>(setMuscleGroup);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    getMuscleGroup();
  }, []);

    const getMuscleGroup = useCallback(async () => {
      try {
        const data = await fetchMuscleGroups();

        setMuscleGroup(data);
      } catch (err) {
        console.error("Failed to load Muscle Groups", err);
      }
    }, []);

  const confirmCreate = async () => {
    if (!createDraft.name) return;

    const payload: CreateMuscleGroup = {
      name: createDraft.name,
    };

    await createMuscleGroup(payload);

    await getMuscleGroup();

    setIsCreating(false);
    setCreateDraft({ name: "" });
  };

  const confirmEdit = async () => {
    if (editingId == null) return;

    const data: EditMuscleGroup = {
      name: editDraft.name,
    };

    await updateMuscleGroup(editingId, data);

    await getMuscleGroup();

    setEditingId(null);
    setEditDraft({});
  };

  const confirmDeleteMuscleGroup = async (id: number) => {
    try {
      await deleteMuscleGroup(id);
      await getMuscleGroup();
    } catch (e) {
      console.error("Failed to delete muscle group", e);
    }
  };

  const startEdit = (item: MuscleGroup) => {
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
        <h1>Muscle Groups</h1>
        <SlButton variant="primary" onClick={() => setIsCreating(true)}>
          Add Muscle Group
        </SlButton>
      </div>

      {isCreating && (
        <div className={styles.addItemRow}>
          <div className={styles.itemHeader}>
            <SlInput
              value={createDraft.name ?? ""}
              placeholder="Muscle Group"
              maxlength={20}
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
                setCreateDraft({ name: "" });
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
          items={muscleGroup.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {muscleGroup.map((item) => {
            const isEditing = item.id === editingId;
            return (
              <SortableItem key={item.id} id={item.id}>
                <div className={styles.itemRow}>
                  <div className={styles.itemHeader}>
                    {isEditing ? (
                      <>
                        <SlInput
                          value={editDraft.name ?? ""}
                          placeholder="Muscle Group"
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
                      </>
                    ) : (
                      <>
                        <p>{item.name}</p>
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
                          onClick={() => confirmDeleteMuscleGroup(item.id)}
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
