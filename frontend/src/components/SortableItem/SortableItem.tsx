import React, { HTMLAttributes } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { UniqueIdentifier } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import styles from './SortableItem.module.scss';

interface SortableItemProps  extends Omit<HTMLAttributes<HTMLDivElement>, "id">  {
  id: UniqueIdentifier;
  children: React.ReactNode;
}

export const SortableItem : React.FC<SortableItemProps>  = ({ id, children, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const dynamicStyle: React.CSSProperties = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      className={`${styles.item} ${isDragging ? styles.dragging : ''}`}
      style={dynamicStyle}
      {...attributes}
      {...listeners}
      {...props}
    >
      {children}
    </div>
  );
};
