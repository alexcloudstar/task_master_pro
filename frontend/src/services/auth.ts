import { toast } from 'sonner';

type TRegister = {
  clerk_id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  username: string;
};

export const signup = async ({
  clerk_id,
  first_name,
  last_name,
  email_address,
  username,
}: TRegister): Promise<boolean> => {
  try {
    const res = await fetch('http://localhost:8000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clerk_id,
        first_name,
        last_name,
        email_address,
        username,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    toast.success('Account created successfully');

    return res.ok;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
};
