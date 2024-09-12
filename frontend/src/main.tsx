import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';

import { routeTree } from './routeTree.gen';
import { createRouter } from '@tanstack/react-router';

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

// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
