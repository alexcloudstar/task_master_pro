import { Add } from '@/components/pages/Projects';
import { columns } from '@/components/pages/Projects/Columns';
import { DataTable } from '@/components/pages/Projects/DataTable';
import { payments } from '@/lib/constants';
import { createLazyFileRoute } from '@tanstack/react-router';

const Projects = () => {
  return (
    <div>
      <Add />
      <DataTable columns={columns} data={payments} />
    </div>
  );
};

export const Route = createLazyFileRoute('/_authenticated/projects')({
  component: Projects,
});
