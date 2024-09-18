import { Add } from '@/components/pages/Projects';
import { DataTable } from '@/components/pages/Projects/DataTable';
import { createColumns } from '@/components/Table/Columns';
import { TAction } from '@/components/Table/types';
import { Button } from '@/components/ui/button';
import { TProject } from '@/lib/types';
import { createLazyFileRoute } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

const Projects = () => {
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

  const projects: TProject[] = [
    {
      id: 1,
      title: 'Hi there 33',
      description: 'test project',
      color: 'white',
      created_by_id: 1,
      created_at: new Date('2024-09-16T19:15:22.909Z').toLocaleDateString(),
      updated_at: new Date('2024-09-16T19:15:22.909Z').toLocaleDateString(),
    },
    {
      id: 2,
      title: 'Project 2',
      description: 'test project 2',
      color: 'black',
      created_by_id: 2,
      created_at: new Date('2024-09-16T19:15:22.909Z').toLocaleDateString(),
      updated_at: new Date('2024-09-16T19:15:22.909Z').toLocaleDateString(),
    },
  ];

  const onCopy = (text: string) => navigator.clipboard.writeText(text);

  const actions: TAction[] = [
    {
      title: 'Project title',
      onClick: onCopy.bind(null, ''),
    },
    {
      title: 'View customer',
      onClick: () => {},
    },
    {
      title: 'View payment details',
      onClick: () => {},
    },
  ];

  const columns = createColumns(projectColumns, actions);

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
