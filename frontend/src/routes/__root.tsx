import AsideNavigation from '@/components/AsideNavigation';
import { TanStackRouterDevtools } from '@/components/TanStackRouterDevtools';
import { useAuth } from '@clerk/clerk-react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Suspense } from 'react';

const Main = () => {
  const auth = useAuth();

  return (
    <>
      {auth.isSignedIn && <AsideNavigation />}
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
