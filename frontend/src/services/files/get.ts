import { TToken } from '@/lib/types';

export const getAssets = async ({
  token,
  folder,
  file = '',
}: {
  token: TToken['token'];
  folder: string;
  file?: string;
}): Promise<{
  data: string | string[];
}> => {
  const baseURL = `http://localhost:8000/api/assets/${folder}/${file}`;

  try {
    const res = await fetch(baseURL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { data }: { data: string | string[] } = await res.json();

    return { data };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
};
