import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './main';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { useAuth } from '@clerk/clerk-react';

const queryClient = new QueryClient();

const App = () => {
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
