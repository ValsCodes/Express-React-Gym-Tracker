// CrudDndManager.tsx
import {  DndContext, closestCenter, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {  SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import { useEffect, useState, useCallback } from "react";

type CrudDndManagerProps<T, CreateDto, UpdateDto> = {
  /** Unique key for react-query / caching */
  queryKey: string;

  /** Load the full list */
  fetchItems: () => Promise<T[]>;

  /** Create a new item */
  createItem: (dto: CreateDto) => Promise<void>;

  /** Update an existing item */
  updateItem: (id: number, dto: UpdateDto) => Promise<void>;

  /** Delete an item */
  deleteItem: (id: number) => Promise<void>;

  /** Render one row in “view” mode */
  renderItem: (item: T, onEdit: (item: T) => void, onDelete: (id: number) => void) => React.ReactNode;

  /** Render one row in “edit” or “create” mode */
  renderForm: (
    draft: Partial<T>,
    onChange: (draft: Partial<T>) => void,
    onConfirm: () => void,
    onCancel: () => void,
  ) => React.ReactNode;

  /** Extract the numeric ID from your item */
  getId: (item: T) => number;

  /** Produce a Create DTO from the draft */
  toCreateDto: (draft: Partial<T>) => CreateDto;

  /** Produce an Update DTO from the draft */
  toUpdateDto: (draft: Partial<T>) => UpdateDto;
};

export function CrudDndManager<T, C, U>(props: CrudDndManagerProps<T, C, U>) {
  const {
    fetchItems, createItem, updateItem, deleteItem,
    renderItem, renderForm,
    getId, toCreateDto, toUpdateDto,
  } = props;

  const [items, setItems] = useState<T[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Partial<T>>({});
  const [isCreating, setIsCreating] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const load = useCallback(async () => {
    const data = await fetchItems();
    setItems(data);
  }, [fetchItems]);

  useEffect(() => {
    load();
  }, [load]);

  const handleConfirmCreate = async () => {
    await createItem(toCreateDto(draft));
    setIsCreating(false);
    setDraft({});
    await load();
  };

  const handleConfirmEdit = async () => {
    if (editingId == null) return;
    await updateItem(editingId, toUpdateDto(draft));
    setEditingId(null);
    setDraft({});
    await load();
  };

  const handleDelete = async (id: number) => {
    await deleteItem(id);
    await load();
  };

  const handleDragEnd = (event: any) => {
    // you can create a simple reorder util here, or accept a handler prop
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex(i => getId(i) === active.id);
      const newIndex = items.findIndex(i => getId(i) === over.id);
      const reordered = [...items];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);
      setItems(reordered);
      // optionally persist new order: call updateItem for each, or a bulk-reorder service
    }
  };

  return (
    <div>
      <button onClick={() => { setIsCreating(true); setDraft({}); }}>
        Add New
      </button>

      {isCreating &&
        renderForm(
          draft,
          d => setDraft(d),
          handleConfirmCreate,
          () => setIsCreating(false),
        )
      }

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map(getId)}
          strategy={verticalListSortingStrategy}
        >
          {items.map(item => {
            const id = getId(item);
            const isEditing = id === editingId;

            return (
              <div key={id} data-id={id}>
                {isEditing
                  ? renderForm(
                      draft,
                      d => setDraft(d),
                      handleConfirmEdit,
                      () => setEditingId(null),
                    )
                  : renderItem(
                      item,
                      i => { setEditingId(id); setDraft(i); },
                      handleDelete,
                    )}
              </div>
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
}
