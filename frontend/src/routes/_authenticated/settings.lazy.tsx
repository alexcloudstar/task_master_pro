import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/settings')({
  component: Settings,
});

function Settings() {
  return <div>Hello from Settings!</div>;
}
