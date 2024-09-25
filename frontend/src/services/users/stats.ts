import { TToken } from '@/lib/types';

export type TStats = {
  users: number;
  projects: number;
  tasks: number;
};

export const getStats = async ({ token }: TToken): Promise<TStats> => {
  try {
    const res = await fetch('http://localhost:8000/api/users/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const { stats }: { stats: TStats } = await res.json();

    return stats;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
};
