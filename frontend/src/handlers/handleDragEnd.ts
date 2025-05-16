import { DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

export function createDragEndHandler<T extends { id: UniqueIdentifier }>(
  setItems: React.Dispatch<React.SetStateAction<T[]>>
) {
  return (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((current) => {
        const oldIndex = current.findIndex((i) => i.id === active.id);
        const newIndex = current.findIndex((i) => i.id === over.id);
        return arrayMove(current, oldIndex, newIndex);
      });
    }
  };
}