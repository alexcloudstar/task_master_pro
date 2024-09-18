import { Loader } from '@/components/Loader';
import { Add } from '@/components/pages/Projects';
import { DataTable } from '@/components/pages/Projects/DataTable';
import { createColumns } from '@/components/Table/Columns';
import { TAction } from '@/components/Table/types';
import { Button } from '@/components/ui/button';
import useGetToken from '@/hooks/useGetToken';
import { TProject } from '@/lib/types';
import { getProjects } from '@/services/projects';
import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

const projectColumns: ColumnDef<TProject>[] = [
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

  const actions: TAction[] = [
    {
      title: 'View project',
      onClick: () => alert('Should do something, right?'),
    },
    {
      title: 'Action 2',
      onClick: () => alert('Should do something, right?'),
    },
  ];

  const columns = createColumns(projectColumns, actions, 'title');

    const projects = data?.map((project) => ({
        ...project,
        created_at: new Date(project.created_at).toLocaleDateString(),
        updated_at: new Date(project.updated_at).toLocaleDateString(),
    }));

    if (isLoading) return <Loader />

    if (isError) return <div>Error</div>

    if(!projects) return <div>No projects</div>

  return (
    <div>
      <Add />
      <DataTable columns={columns} data={projects} />
    </div>
  );
};

export const Route = createLazyFileRoute('/_authenticated/projects')({
  component: Projects,
});
