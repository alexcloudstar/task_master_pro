import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

type TProps = {
  id: string;
  children: React.ReactNode;
};

const Draggable = ({ id, children }: TProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </button>
  );
};

export default Draggable;
