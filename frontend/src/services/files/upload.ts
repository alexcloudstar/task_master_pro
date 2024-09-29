import { TToken } from '@/lib/types';

export const uploadAssets = async ({
  token,
  folder,
  formData,
}: {
  token: TToken['token'];
  formData: FormData;
  folder: string;
}): Promise<{
  url: string;
}> => {
  const baseURL = `http://localhost:8000/api/assets/${folder}`;

  try {
    const res = await fetch(baseURL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const { url }: { url: string } = await res.json();

    return { url };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
};
