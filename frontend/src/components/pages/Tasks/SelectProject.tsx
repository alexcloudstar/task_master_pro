import { Loader } from '@/components/Loader';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useGetToken from '@/hooks/useGetToken';
import { getProjects } from '@/services/projects';
import { useQuery } from '@tanstack/react-query';

const SelectProject = () => {
  const token = useGetToken();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['projects'],
    queryFn: () => getProjects({ token: token as string }),
    enabled: !!token,
  });

  if (isLoading) return <Loader />;

  if (isError) return <div>Error</div>;

  if (!data) return <div>No projects</div>;

  return (
    <div className='space-y-4'>
      <h5>Select a Project</h5>
      <Select>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Select a project' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Projects</SelectLabel>
            {data.map((project) => (
              <SelectItem key={project.id} value={project.id.toString()}>
                {project.title}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectProject;
