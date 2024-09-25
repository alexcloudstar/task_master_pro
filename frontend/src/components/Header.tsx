import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Input } from './ui/input';
import { SignedIn, SignOutButton, useUser } from '@clerk/clerk-react';
import BreadcrumbNav from './BreadcrumbNav';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const Header = () => {
  const { user } = useUser();

  return (
    <header className='flex items-center justify-between'>
      <BreadcrumbNav />
      <div className='flex items-center justify-between w-full gap-5'>
        <div className='relative ml-auto flex-1 md:grow-0'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            type='search'
            placeholder='Search...'
            className='w-fit rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]'
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              className='overflow-hidden rounded-full'
            >
              <img
                src={user?.imageUrl}
                width={36}
                height={36}
                alt='Avatar'
                className='overflow-hidden rounded-full'
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to='/settings'>Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignedIn>
                <SignOutButton>Sign Out</SignOutButton>
              </SignedIn>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
