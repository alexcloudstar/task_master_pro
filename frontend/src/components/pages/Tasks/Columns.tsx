import { Draggable, Droppable } from '@/components/DragNDrop';
import useGetToken from '@/hooks/useGetToken';
import { updateTask } from '@/services/tasks';
import { ETaskStatus, TTask } from '@/services/tasks/types';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

type TColumsProps = {
  tasks: TTask[];
};

const Columns = ({ tasks }: TColumsProps) => {
  const [tasksState, setTasksState] = useState<TTask[]>(tasks);

    const token = useGetToken();

  const mutation = useMutation({
    mutationFn: ({id, fields}: {
            id: string;
            fields: Partial<TTask>;
        }) =>
      updateTask({ token: token as string, id, fields }),
  });

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active || !over) return;

    const activeId = active.id;
    const overId = over.id;

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
            await mutation.mutateAsync({ id: activeTask.id.toString(), fields: { status: ETaskStatus[overId as keyof typeof ETaskStatus] } });

            setTasksState(newTasks);


            toast.success("Task updated successfully");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.message);
        }
  };

  return (
    <div className='grid grid-flow-col grid-cols-5 gap-1'>
      <DndContext onDragEnd={onDragEnd}>
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
