import { Droppable, Sortable } from '@/components/DragNDrop';
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
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type TColumsProps = {
  tasks: TTask[];
};

const Columns = ({ tasks }: TColumsProps) => {
  const [tasksState, setTasksState] = useState<TTask[]>(tasks);

  useEffect(() => {
    setTasksState(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const token = useGetToken();

  const queryClient = new QueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, fields }: { id: string; fields: Partial<TTask> }) =>
      updateTask({ token: token as string, id, fields }),
  });

  const onSortEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active || !over) return;

    let items: TTask[] = tasksState;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(
        (item) => item.id === parseInt(active.id.toString()),
      );
      const newIndex = items.findIndex(
        (item) => item.id === parseInt(over?.id.toString() ?? ''),
      );

      items = arrayMove(items, oldIndex, newIndex);

      setTasksState(items);

      try {
        Promise.all(
          items.map((task, index) =>
            mutation.mutateAsync({
              id: task.id.toString(),
              fields: { order: index, status: task.status },
            }),
          ),
        );

        queryClient.invalidateQueries({ queryKey: ['tasks'] });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active || !over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!Object.keys(ETaskStatus).includes(overId.toString())) {
      onSortEnd(event);
      return;
    }

    const activeTask = tasksState.find(
      (task) => task.id === parseInt(activeId.toString()),
    );

    if (!activeTask) return;

    const newTasks = tasksState.map((task) => {
      if (task.id === parseInt(activeId.toString())) {
        return {
          ...task,
          status: ETaskStatus[overId as keyof typeof ETaskStatus],
        };
      }

      return task;
    });

    try {
      await mutation.mutateAsync({
        id: activeTask.id.toString(),
        fields: { status: ETaskStatus[overId as keyof typeof ETaskStatus] },
      });

      setTasksState(newTasks);

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
                <h6 className='capitalize mb-5'>
                  {ETaskStatus[key].replace('_', ' ')}
                </h6>
                <SortableContext
                  items={tasksState.filter(
                    (task) => task.status === ETaskStatus[key],
                  )}
                  strategy={verticalListSortingStrategy}
                >
                  {tasksState
                    ?.filter((task) => task.status === ETaskStatus[key])
                    .sort((a, b) => a.order - b.order)
                    .map((task) => (
                      <Sortable key={task.id} id={task.id.toString()}>
                        {task.title}
                      </Sortable>
                    ))}
                </SortableContext>
              </Droppable>
            );
          },
        )}
      </DndContext>
    </div>
  );
};

export default Columns;
