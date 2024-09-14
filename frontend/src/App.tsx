import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { useCookies } from 'react-cookie';
import { router } from './main';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';

// Register the router instance for type safety
const queryClient = new QueryClient();

const App = () => {
  const [cookie] = useCookies(['token']);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={router} context={{ auth: cookie.token }} />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
