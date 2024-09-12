import AsideNavigation from '@/components/AsideNavigation';
import Header from '@/components/Header';
import { TanStackRouterDevtools } from '@/components/TanStackRouterDevtools';
import { useAuth } from '@clerk/clerk-react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Suspense } from 'react';

const Main = () => {
  const auth = useAuth();

  return (
    <>
      {auth.isSignedIn && <AsideNavigation />}
      <div className='flex min-h-screen w-full flex-col'>
        <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
          {auth.isSignedIn && <Header />}
          <Outlet />
        </main>
      </div>
      <Suspense>
        <TanStackRouterDevtools position='bottom-right' />
      </Suspense>
    </>
  );
};

export const Route = createRootRoute({
  component: Main,
});
