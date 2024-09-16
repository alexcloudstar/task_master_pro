import { Add } from '@/components/pages/Projects';
import { createLazyFileRoute } from '@tanstack/react-router';

const Projects = () => {
  return (
    <div>
      <Add />
      Hello from Projects
    </div>
  );
};

export const Route = createLazyFileRoute('/_authenticated/projects')({
  component: Projects,
});
