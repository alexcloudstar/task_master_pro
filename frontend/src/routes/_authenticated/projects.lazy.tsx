import { Add } from '@/components/pages/Projects';
import { DataTable } from '@/components/pages/Projects/DataTable';
import { createColumns } from '@/components/Table/Columns';
import { Button } from '@/components/ui/button';
import { payments } from '@/lib/constants';
import { createLazyFileRoute } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

const Projects = () => {
    const projectColumns: ColumnDef<Payment>[] = [
        {
            accessorKey: 'status',
            header: 'Status'
        },
        {
            accessorKey: 'email',
            header: ({ column}) => (
                <Button
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Email
                    <ArrowUpDown className='ml-2 size-4' />
                </Button>
            )
        },
        {
            accessorKey: 'amount',
            header: () => <div className='text-right'>Amount</div>,
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue('amount'));
                const formatted = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }).format(amount);

                return <div className='text-right font-medium'>{formatted}</div>;
            }
        }
    ];

    const columns = createColumns(projectColumns);

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
