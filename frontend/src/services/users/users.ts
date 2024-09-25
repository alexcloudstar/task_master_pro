import { TToken } from '@/lib/types';
import { TUser } from './types';

export const getUsers = async ({ token }: TToken): Promise<TUser[]> => {
  try {
    const res = await fetch('http://localhost:8000/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const { users }: { users: TUser[] } = await res.json();

    return users;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
};
