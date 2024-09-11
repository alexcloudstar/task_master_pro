import { TanStackRouterDevtools } from '@/components/TanStackRouterDevtools'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
            <Suspense>
                <TanStackRouterDevtools position='bottom-right' />
            </Suspense>
    </>
  ),
})

