import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { TRowActionsProps } from './types';

const RowActions = <T,>({
  row,
  actions,
  copyIdentifier,
}: TRowActionsProps<T>) => {
  const identifier = row.original[copyIdentifier];

  const onCopy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='size-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={onCopy.bind(null, identifier as string)}
          className='capitalize'
        >
          Copy {copyIdentifier as string}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {actions.map(({ title, onClick }) => (
          <DropdownMenuItem
            key={title}
            // @ts-expect-error id exists
            onClick={onClick.bind(null, parseInt(row.original?.id))}
          >
            {title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RowActions;
