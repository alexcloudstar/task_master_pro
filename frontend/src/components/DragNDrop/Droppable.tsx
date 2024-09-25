import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';

type TProps = {
  children: React.ReactNode;
  id: string;
};

const Droppable = ({ children, id }: TProps) => {
  const classes = 'min-h-[600px] h-full bg-sky-50 w-full rounded-lg p-5';

  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  if (isOver) {
    return (
      <div
        id={id}
        ref={setNodeRef}
        className={cn(classes, 'shadow-md rounded-lg')}
      >
        {children}
      </div>
    );
  }

  return (
    <div id={id} ref={setNodeRef} className={cn(classes)}>
      {children}
    </div>
  );
};

export default Droppable;
