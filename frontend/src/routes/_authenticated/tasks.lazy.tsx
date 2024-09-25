import { Loader } from '@/components/Loader';
import { Add, Columns, SelectProject } from '@/components/pages/Tasks';
import useGetToken from '@/hooks/useGetToken';
import { TProject } from '@/services/projects/types';
import { getProjectTasks } from '@/services/tasks/get';
import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

const Tasks = () => {
  const token = useGetToken();
  const [selectedProjectId, setSelectedProjectId] = useState<
    TProject['id'] | null
  >(null);

  const { isLoading, isError, data } = useQuery({
    queryKey: ['project_tasks'],
    queryFn: () =>
      getProjectTasks({
        token: token as string,
        id: selectedProjectId?.toString() ?? '',
      }),
    enabled: !!token && !!selectedProjectId,
  });

  if (isLoading) return <Loader />;

  if (isError) return <div>Error</div>;

  return (
    <div className='space-y-10'>
      <div className='flex items-center justify-between'>
        <SelectProject
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
        />
        {selectedProjectId && <Add selectedProjectId={selectedProjectId} />}
      </div>
      {selectedProjectId && <Columns tasks={data ?? []} />}
    </div>
  );
};

export const Route = createLazyFileRoute('/_authenticated/tasks')({
  component: Tasks,
});
