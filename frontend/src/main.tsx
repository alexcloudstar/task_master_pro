import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';

import { routeTree } from './routeTree.gen';
import { createRouter } from '@tanstack/react-router';
import { ClerkProvider } from '@clerk/clerk-react';

export const router = createRouter({
  routeTree,
  context: {
    // auth will initially be undefined
    // We'll be passing down the auth state from within a React component
    auth: undefined!,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl='/'>
        <App />
      </ClerkProvider>
    </StrictMode>,
  );
}
