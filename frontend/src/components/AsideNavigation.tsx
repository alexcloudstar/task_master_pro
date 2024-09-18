import { Settings, Trello } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { routes } from '@/lib/constants';
import { Link } from '@tanstack/react-router';
import { Fragment } from 'react/jsx-runtime';
import { cn } from '@/lib/utils';

const AsideNavigation = () => {
  const linkSize = 'size-9 md:size-8';
  const iconSize = 'size-5 md:size-4';
  const activeLinkClasses = '[&.active]:text-sky-500';

  return (
    <aside className='fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex drop-shadow-md'>
      <nav className='flex flex-col items-center gap-4 px-2 py-4'>
        <Link
          to='/'
          className={cn(
            'flex items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground',
            linkSize,
            iconSize,
          )}
        >
          <Trello
            className={cn('transition-all group-hover:scale-110', iconSize)}
          />
          <span className='sr-only'>Task Master Pro</span>
        </Link>
        {routes.map(({ id, to, label, Icon }) => (
          <Fragment key={id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={to}
                  className={cn(
                    'flex items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground',
                    linkSize,
                    iconSize,
                    activeLinkClasses,
                  )}
                >
                  <Icon className={iconSize} />

                  <span className='sr-only'>{label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side='right'>{label}</TooltipContent>
            </Tooltip>
          </Fragment>
        ))}
      </nav>
      <nav className='mt-auto flex flex-col items-center gap-4 px-2 py-4'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to='/settings'
              className={cn(
                'flex items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground',
                linkSize,
                iconSize,
                activeLinkClasses,
              )}
            >
              <Settings className={iconSize} />
              <span className='sr-only'>Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side='right'>Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
};

export default AsideNavigation;
