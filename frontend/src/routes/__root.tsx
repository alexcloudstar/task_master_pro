import AsideNavigation from '@/components/AsideNavigation';
import { TanStackRouterDevtools } from '@/components/TanStackRouterDevtools';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Suspense } from 'react';
import { useCookies } from 'react-cookie';

const Main = () => {
  const [cookie] = useCookies(['token']);

  return (
    <>
      {cookie.token && <AsideNavigation />}
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools position='bottom-right' />
      </Suspense>
    </>
  );
};

export const Route = createRootRoute({
  component: Main,
});
