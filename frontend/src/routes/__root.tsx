import Navigation from '@/components/Navigation';
import { TanStackRouterDevtools } from '@/components/TanStackRouterDevtools';
import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { Suspense } from 'react';

export const Route = createRootRoute({
  component: () => (
    <>
      <Navigation />
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools position='bottom-right' />
      </Suspense>
    </>
  ),
});
