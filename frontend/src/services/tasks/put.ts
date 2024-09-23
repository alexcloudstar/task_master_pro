import { TToken } from '@/lib/types';
import { TTask } from './types';

export const updateTask = async ({
  token,
  id,
  fields,
}: { id: string; fields: Partial<TTask> } & TToken): Promise<void> => {
  try {
    const res = await fetch(`http://localhost:8000/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...fields }),
    });

    const data = await res.json();

    if (!data.ok && !data.task) {
      throw new Error(data.message);
    }

    return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
};
