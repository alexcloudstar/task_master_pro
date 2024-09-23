import { Draggable, Droppable } from '@/components/DragNDrop';
import { SortableItem } from '@/components/DragNDrop/SortableItem';
import useGetToken from '@/hooks/useGetToken';
import { updateTask } from '@/services/tasks';
import { ETaskStatus, TTask } from '@/services/tasks/types';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

type TColumsProps = {
  tasks: TTask[];
};

const Columns = ({ tasks }: TColumsProps) => {
  const [tasksState, setTasksState] = useState<TTask[]>(tasks);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const token = useGetToken();

  const mutation = useMutation({
    mutationFn: ({ id, fields }: { id: string; fields: Partial<TTask> }) =>
      updateTask({ token: token as string, id, fields }),
  });

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active || !over) return;

    const activeId = active.id;
    const overId = over.id;
    let newItems = tasksState;

    const activeTask = tasksState.find(
      (task) => task.id === parseInt(activeId.toString()),
    );

    if (!activeTask) return;

    if (active.id !== over.id) {
      const oldIndex = tasksState.findIndex(
        (task) => task.id === parseInt(activeId.toString()),
      );
      const newIndex = tasksState.findIndex(
        (task) => task.id === parseInt(overId.toString()),
      );
      const newTasks = arrayMove(tasksState, oldIndex, newIndex);

      newItems = newTasks.map((task, index) => ({
        ...task,
        order: newIndex === index ? oldIndex : index,
        status:
          index === oldIndex
            ? ETaskStatus[overId as keyof typeof ETaskStatus]
            : task.status,
      }));
    }

    try {
      await Promise.all(
        newItems.map((task) =>
          mutation.mutateAsync({
            id: task.id.toString(),
            fields: {
              order: task.order,
              status: task.status,
            },
          }),
        ),
      );

      toast.success('Tasks sorted successfully');
      setTasksState(newItems);

      toast.success('Task updated successfully');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className='grid grid-flow-col grid-cols-5 gap-1'>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        {(Object.keys(ETaskStatus) as Array<keyof typeof ETaskStatus>).map(
          (key) => {
            return (
              <Droppable key={key} id={key}>
                <div className='min-h-[600px] h-full bg-sky-50 w-full rounded-lg p-5'>
                  <h6 className='capitalize mb-5'>
                    {ETaskStatus[key].replace('_', ' ')}
                  </h6>
                  <div className='flex flex-col gap-4'>
                    {tasksState
                      ?.filter((task) => task.status === ETaskStatus[key])
                      .sort((a, b) => a.order - b.order)
                      .map((task) => (
                        <Draggable key={task.id} id={task.id.toString()}>
                          <div className='bg-white p-4 rounded-lg shadow'>
                            <p>{task.title}</p>
                          </div>
                        </Draggable>
                      ))}
                  </div>
                </div>
              </Droppable>
            );
          },
        )}
      </DndContext>
    </div>
  );
};

export default Columns;
