import { TToken } from '@/lib/types';
import { TProject } from './types';

export type TCreateProject = Omit<TProject, 'id'>;

export const postProject = async ({
  token,
  createdProject,
}: {
  token: TToken['token'];
  createdProject: TCreateProject;
}): Promise<TProject> => {
  try {
    const res = await fetch('http://localhost:8000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(createdProject),
    });

    const { project }: { project: TProject } = await res.json();

    return project;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
};
