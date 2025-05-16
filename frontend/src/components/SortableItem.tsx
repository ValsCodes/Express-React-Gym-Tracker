import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { UniqueIdentifier } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: UniqueIdentifier;
  children: React.ReactNode;
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style: React.CSSProperties = {
    display: `flex`,
    justifySelf: `center`,
    justifyContent: `space-between`,
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    padding: '.5rem',
    width: '500px',
    margin: '.25rem .625rem',
    border: '.0625rem solid #ccc',
    borderRadius: '.25rem',
    background: '#fff',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};
