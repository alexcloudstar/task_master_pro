import { Draggable, Droppable } from '@/components/DragNDrop';
import { ETaskStatus, TTask } from '@/services/tasks/types';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useState } from 'react';

type TColumsProps = {
  tasks: TTask[];
};

const Columns = ({ tasks }: TColumsProps) => {
    const [tasksState, setTasksState] = useState<TTask[]>(tasks);

    const onDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        if (!active || !over) return;

        const activeId = active.id;
        const overId = over.id;

        const activeTask = tasksState.find((task) => task.id === parseInt(activeId.toString()));

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

        setTasksState(newTasks);
    }

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
