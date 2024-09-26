import { Loader } from '@/components/Loader';
import { Add } from '@/components/pages/Projects';
import { createColumns } from '@/components/Table/Columns';
import { DataTable } from '@/components/Table/DataTable';
import { TAction } from '@/components/Table/types';
import { Button } from '@/components/ui/button';
import useGetToken from '@/hooks/useGetToken';
import { getProjects } from '@/services/projects';
import { deleteProject } from '@/services/projects/delete';
import { TProject } from '@/services/projects/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';

type TCustomProject = {
  created_at: string;
  updated_at: string;
} & Omit<TProject, 'created_at' | 'updated_at'>;

const projectColumns: ColumnDef<TCustomProject>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <Button
        variant='ghost'
        className='pl-0'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Description
        <ArrowUpDown className='ml-2 size-4' />
      </Button>
    ),
  },
  {
    accessorKey: 'color',
    header: ({ column }) => (
      <Button
        variant='ghost'
        className='pl-0'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Color
        <ArrowUpDown className='ml-2 size-4' />
      </Button>
    ),
  },
  {
    accessorKey: 'created_by_id',
    header: 'Created By',
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated At',
  },
];

const Projects = () => {
  const token = useGetToken();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['projects'],
    queryFn: () => getProjects({ token: token as string }),
    enabled: !!token,
  });

  const mutation = useMutation({
    mutationFn: (id: TProject['id']) =>
      deleteProject({ token: token as string, id}),
  });

    const queryClient = useQueryClient();

    const onDeleteProject = async (id: number) => {
        const project = data?.find((project) => project.id === id);

        if (!project) return;

    if (!window.confirm(`Are you sure you want to delete the project ${project.title}?`)) return;

        try { 
            await mutation.mutateAsync(id);



            toast.success('Project deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.message);
        }
    }

  const actions: TAction[] = [
    {
      title: 'View project',
      onClick: (id: number) => alert(`View project ${id}`),
    },
    {
      title: 'Delete project',
      onClick: onDeleteProject,
    },
  ];

  const columns = createColumns(projectColumns, actions, 'title');

  const projects =
    data?.map((project) => ({
      ...project,
      created_at: new Date(project.created_at).toLocaleDateString(),
      updated_at: new Date(project.updated_at).toLocaleDateString(),
    })) ?? [];

  if (isLoading) return <Loader />;

  if (isError) return <div>Error</div>;

  if (!projects) return <div>No projects</div>;

  return (
    <div>
      <Add />
      <DataTable columns={columns} data={projects} filterIdentifier='title' />
    </div>
  );
};

export const Route = createLazyFileRoute('/_authenticated/projects')({
  component: Projects,
});
