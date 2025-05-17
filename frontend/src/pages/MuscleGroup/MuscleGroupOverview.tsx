import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import { SortableItem } from '../../components/SortableItem/SortableItem';
import { createDragEndHandler } from '../../handlers/handleDragEnd';

interface MuscleGroup {
  id: number;
  name: string;
}

export const MuscleGroupOverview = () => {
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const handleDragEnd = createDragEndHandler<MuscleGroup>(setMuscleGroups);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    getMuscleGroups();
  }, []);

 const getMuscleGroups = async () => {
   await fetch("http://localhost:3001/muscle-group")
     .then((res) => res.json())
     .then((data: MuscleGroup[]) => setMuscleGroups(data))
     .catch(console.error);
 };

  return (
    <>
      <h1>Muscle Group Overview</h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={muscleGroups.map((mg) => mg.id)}
          strategy={verticalListSortingStrategy}
        >
          {muscleGroups.map((mg) => (
            <SortableItem key={mg.id} id={mg.id}>
              {mg.name}
              <div>
                  <button>Edit</button>
                  <button>Delete</button>
              </div>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </>
  );
};
