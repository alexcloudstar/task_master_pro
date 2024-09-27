import { TToken } from '@/lib/types';
import { TInsertProject, TProject } from './types';

export const updateOrCreateProject = async ({
  token,
  createdProject,
  isCreating,
}: {
  token: TToken['token'];
  createdProject: TInsertProject;
  isCreating: boolean;
}): Promise<TProject> => {
  const baseURL = 'http://localhost:8000/api/projects';
  const url = isCreating ? baseURL : `${baseURL}/${createdProject.id}`;

  try {
    const res = await fetch(url, {
      method: isCreating ? 'POST' : 'PUT',
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
