import { TToken } from '@/lib/types';
import { TProject } from './types';

export const getProjects = async ({ token }: TToken): Promise<TProject[]> => {
  try {
    const res = await fetch('http://localhost:8000/api/projects', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const { projects }: { projects: TProject[] } = await res.json();

    return projects;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
};
