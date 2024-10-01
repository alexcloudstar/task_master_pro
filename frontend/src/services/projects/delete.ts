import { TToken } from '@/lib/types';

export const deleteProject = async ({
  token,
  id,
}: TToken & { id: number }): Promise<string> => {
  try {
    const res = await fetch(`http://localhost:8000/api/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to delete project');
    }

    const { message }: { message: string } = await res.json();

    return message;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
};
