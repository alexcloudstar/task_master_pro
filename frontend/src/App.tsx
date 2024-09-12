import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { useCookies } from 'react-cookie';
import { router } from './main';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';

// Register the router instance for type safety
const queryClient = new QueryClient();

const App = () => {
  const [cookie] = useCookies(['token']);
  const auth = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={router} context={{ auth: auth.isSignedIn }} />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
