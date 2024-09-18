import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import RowActions from './RowActions';
import { TAction } from './types';

export type Header<T> = ColumnDef<T>['header'];

export const createColumns = <T,>(
  columns: ColumnDef<T>[],
  actions: TAction[],
  copyIdentifier: keyof T,
): ColumnDef<T>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  ...columns,
  {
    id: 'actions',
    cell: ({ row }) => RowActions({ row, actions, copyIdentifier }),
  },
];
