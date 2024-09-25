import { TToken } from '@/lib/types';
import { TTask } from './types';

export type TCreateTask = Omit<TTask, 'id'>;

export const postTask = async ({
  token,
  createdTask,
}: {
  token: TToken['token'];
  createdTask: TCreateTask;
}): Promise<TTask> => {
  try {
    const res = await fetch('http://localhost:8000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(createdTask),
    });

    if (!res.ok) {
      throw new Error('Failed to create task');
    }

    const { task }: { task: TTask } = await res.json();

    return task;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
};
