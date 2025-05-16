import React, { useState } from 'react';
import { SortableItem } from '../../components';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { createDragEndHandler } from '../../handlers/handleDragEnd';

interface Item {
  id: number;
  name: string;
}

const initialItems: Item[] = [
  { id: 1, name: 'name 1' },
  { id: 2, name: 'name 2' },
  { id: 3, name: 'name 3' },
  { id: 4, name: 'name 4' },
  { id: 5, name: 'name 5' },
  { id: 6, name: 'name 6' }
];

export const WorkoutOverview: React.FC = () => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = createDragEndHandler<Item>(setItems);

  return (
    <>
      <h1>Workout Overview</h1>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              {item.name}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </>
  );
};
