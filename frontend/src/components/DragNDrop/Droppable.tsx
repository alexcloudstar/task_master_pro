import { useDroppable } from '@dnd-kit/core';

type TProps = {
  children: React.ReactNode;
  id: string;
};

const Droppable = ({ children, id }: TProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  if (isOver) {
    return (
      <div ref={setNodeRef} className='shadow-md rounded-lg'>
        {children}
      </div>
    );
  }

  return <div ref={setNodeRef}>{children}</div>;
};

export default Droppable;
