import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import useGetToken from '@/hooks/useGetToken';
import { useQuery } from '@tanstack/react-query';
import { getProjects } from '@/services/projects';
import { Loader } from '../Loader';
import { TProject } from '@/services/projects/types';

const RightCard = () => {
  const token = useGetToken();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['projects'],
    queryFn: () => getProjects({ token: token as string }),
    enabled: !!token,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <Card x-chunk='dashboard-01-chunk-5'>
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
      </CardHeader>
      <CardContent className='grid gap-8'>
        {data?.map((project: TProject) => (
          <div className='flex items-center gap-4' key={project.id}>
            <Avatar className='hidden h-9 w-9 sm:flex'>
              <AvatarImage src='/avatars/01.png' alt='Avatar' />
              <AvatarFallback>{project.title[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className='grid gap-1'>
              <p className='text-sm font-medium leading-none'>
                {project.title}
              </p>
              <p className='text-sm text-muted-foreground'>
                {project.description.length > 30
                  ? project.description.substring(0, 30) + '...'
                  : project.description}
              </p>
            </div>
            <div className='ml-auto font-medium'>
              {new Date(project.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RightCard;
