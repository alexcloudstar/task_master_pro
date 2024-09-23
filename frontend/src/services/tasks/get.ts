import { TToken } from '@/lib/types';
import { TTask } from './types';

export const getTasks = async ({ token }: TToken): Promise<TTask[]> => {
  try {
    const res = await fetch('http://localhost:8000/api/tasks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const { tasks }: { tasks: TTask[] } = await res.json();

    return tasks;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getProjectTasks = async ({
  token,
  id,
}: { id: string } & TToken): Promise<TTask[]> => {
  try {
    const res = await fetch(`http://localhost:8000/api/tasks/project/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const { tasks }: { tasks: TTask[] } = await res.json();

    return tasks;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
};
