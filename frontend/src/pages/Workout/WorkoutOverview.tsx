import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { SlButton } from '../../components/index.ts';
import styles from './styles/WorkoutOverview.module.scss';

interface Workout {
  id: number;
  description: string;
  dateAdded: string;
}

export const WorkoutOverview: React.FC = () => {
  const [workout, setWorkouts] = useState<Workout[]>([]);
  const sensors = useSensors(useSensor(PointerSensor));
  const navigate = useNavigate();
  const handleDragEnd = createDragEndHandler<Workout>(setWorkouts);

  useEffect(() => {
    getWorkouts();
  }, []);

  const getWorkouts = async () => {
    await fetch("http://localhost:3001/workout")
      .then((res) => res.json())
      .then((data: Workout[]) => setWorkouts(data))
      .catch(console.error);
  };

  const deleteWorkout = async (id: number) => {
    console.log('delete button clicked')
    try {
      await fetch(`http://localhost:3001/workout/${id}`, {
        method: "DELETE",
      });
      await getWorkouts();
    } catch (e) {
      console.error("Failed to delete workout", e);
    }
  };

  const editWorkout = (id: number) => {
    console.log('edit button clicked')
    navigate(`/workout/${id}`);
  };

  const addWorkout = () => {
    navigate(`/add-workout`);
  };

  return (
    <div>
      <div className={styles.header}>
        <h1>Workouts Overview</h1>
        <SlButton variant="primary" onClick={() => addWorkout()}>Add Workout</SlButton>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={workout.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {workout.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              <div className={styles.itemRow}>
                <div className={styles.itemHeader}>
                <p>{item.description} </p>
                <p>{new Date(item.dateAdded).toLocaleDateString()}</p>
                </div>
                <div className={styles.actionButtons}>
                  <SlButton variant="success" onPointerDown={e => e.stopPropagation()} onClick={() => editWorkout(item.id)}>Edit</SlButton>
                  <SlButton variant="danger" onPointerDown={e => e.stopPropagation()} onClick={() => deleteWorkout(item.id)}>Delete</SlButton>
                </div>
              </div>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};
