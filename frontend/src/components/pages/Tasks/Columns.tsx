import { ETaskStatus, TTask } from '@/services/tasks/types';

type TColumsProps = {
  tasks: TTask[];
};

const Columns = ({ tasks }: TColumsProps) => {
  return (
    <div className='grid grid-flow-col grid-cols-5 gap-1'>
      {(Object.keys(ETaskStatus) as Array<keyof typeof ETaskStatus>).map(
        (key) => {
          return (
            <div
              key={key}
              className='min-h-[600px] h-full bg-sky-50 w-full rounded-lg'
            >
              <h6 className='capitalize my-5 pl-5'>
                {ETaskStatus[key].replace('_', ' ')}
              </h6>
              <div className='flex flex-col gap-4'>
                {tasks
                  ?.filter((task) => task.status === ETaskStatus[key])
                  .map((task) => (
                    <div
                      key={task.id}
                      className='bg-white p-4 rounded-lg shadow'
                    >
                      <p>{task.title}</p>
                    </div>
                  ))}
              </div>
            </div>
          );
        },
      )}
    </div>
  );
};

export default Columns;
