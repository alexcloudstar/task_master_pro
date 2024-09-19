import { TToken } from '@/lib/types';
import { TUser } from './types';

export const getMe = async ({ token }: TToken): Promise<TUser> => {
  try {
    const res = await fetch('http://localhost:8000/api/users/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const { user }: { user: TUser } = await res.json();

    return user;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
};
