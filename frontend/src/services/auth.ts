import { toast } from 'sonner';

type TAuth = {
    email_address: string;
    password: string;
}

type TRegister = {
  first_name: string;
  last_name: string;
} & TAuth;

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

export const login = async ({
  email_address,
  password,
}: TAuth) => {
  try {
    const res = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    toast.success('Login successfully');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast.error(error.message);
  }
};


