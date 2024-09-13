export enum ERole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
  DEVELOPER = 'developer',
  QA = 'qa',
  DESIGNER = 'designer',
  PRODUCT_OWNER = 'product_owner',
  SCRUM_MASTER = 'scrum_master',
}

export type TUser = {
  id: number;
  clerk_id: string;
  role: ERole;
  avatar: string;
  cover: string;
  email_address: string;
  first_name: string;
  last_name: string;
  username: string;
  created_at: string;
  updated_at: string;
};

export const getUsers = async ({
  token,
}: {
  token: string;
}): Promise<{ users: TUser[] }> => {
  try {
    const res = await fetch('http://localhost:8000/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data: { users: TUser[] } = await res.json();

    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
};
