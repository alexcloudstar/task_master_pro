import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type TSortableProps = {
  children: React.ReactNode;
  id: string;
};

const Sortable = ({ id, children }: TSortableProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className='bg-white p-4 rounded-lg shadow w-full mb-4'
    >
      {children}
    </button>
  );
};

export default Sortable;
