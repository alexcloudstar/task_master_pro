import { SelectProject } from '@/components/pages/Tasks';
import { createLazyFileRoute } from '@tanstack/react-router';

const Tasks = () => {
  return (
    <div>
      <SelectProject />
    </div>
  );
};

export const Route = createLazyFileRoute('/_authenticated/tasks')({
  component: Tasks,
});
