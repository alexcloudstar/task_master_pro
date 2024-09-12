import { toast } from 'sonner';

type TRegister = {
  first_name: string;
  last_name: string;
  email_address: string;
  password: string;
};

export const signup = async ({
  first_name,
  last_name,
  email_address,
  password,
}: TRegister) => {
  try {
    const res = await fetch('http://localhost:8000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name,
        last_name,
        email_address,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    toast.success('Account created successfully');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast.error(error.message);
  }
};
