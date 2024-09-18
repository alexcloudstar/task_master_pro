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
import { TAction } from './types';

const RowActions = ({ actions }: { actions: TAction[] }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant='ghost' className='size-8 p-0'>
        <span className='sr-only'>Open menu</span>
        <MoreHorizontal className='size-4' />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align='end'>
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      {actions.map(({ title, onClick }, idx) => (
        <>
          <DropdownMenuItem key={title} onClick={onClick}>
            {title}
          </DropdownMenuItem>
          {idx === 0 ? <DropdownMenuSeparator /> : null}
        </>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default RowActions;
