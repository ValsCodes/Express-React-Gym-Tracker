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
import { SlButton, SlInput } from "../../components/index.ts";

//TODO share style across components
import styles from "../Workout/styles/WorkoutOverview.module.scss";

interface MuscleGroup {
  id: number;
  name: string;
}

interface EditMuscleGroup {
  name?: string;
}

interface CreateMuscleGroup {
  name: string;
}

export const MuscleGroupOverview = () => {
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

  const getMuscleGroup = async () => {
    await fetch("http://localhost:3001/muscle-group")
      .then((res) => res.json())
      .then((data: MuscleGroup[]) => setMuscleGroup(data))
      .catch(console.error);
  };

  const confirmCreate = async () => {
    if (!createDraft.name) return;

    const payload: CreateMuscleGroup = {
      name: createDraft.name,
    };

    await fetch("http://localhost:3001/muscle-group", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((r) => r.json());

    await getMuscleGroup();

    setIsCreating(false);
    setCreateDraft({ name: "" });
  };

  const confirmEdit = async () => {
    if (editingId == null) return;

    const data: EditMuscleGroup = {
      name: editDraft.name,
    };

    await fetch(`http://localhost:3001/muscle-group/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json());

    await getMuscleGroup();

    setEditingId(null);
    setEditDraft({});
  };

  const deleteMuscleGroup = async (id: number) => {
    try {
      await fetch(`http://localhost:3001/muscle-group/${id}`, {
        method: "DELETE",
      });
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
        <h1>Muscle Group Overview</h1>
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
                          onClick={() => deleteMuscleGroup(item.id)}
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
