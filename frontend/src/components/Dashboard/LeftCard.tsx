import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Link } from '@tanstack/react-router';
import useGetToken from '@/hooks/useGetToken';
import { useQuery } from '@tanstack/react-query';
import { Loader } from '../Loader';
import { getTasks } from '@/services/tasks/get';
import { TTask } from '@/services/tasks/types';

const LeftCard = () => {
  const token = useGetToken();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks({ token: token as string }),
    enabled: !!token,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <Card className='xl:col-span-2' x-chunk='dashboard-01-chunk-4'>
      <CardHeader className='flex flex-row items-center'>
        <div className='grid gap-2'>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>Recent tasks and their status</CardDescription>
        </div>
        <Button asChild size='sm' className='ml-auto gap-1'>
          <Link to='/tasks'>
            View All
            <ArrowUpRight className='size-4' />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead className='hidden xl:table-cell'>
                Assigned to
              </TableHead>
              <TableHead className='hidden xl:table-cell'>Status</TableHead>
              <TableHead className='hidden xl:table-cell'>Created</TableHead>
              <TableHead className='text-right'>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((task: TTask) => (
              <TableRow key={task.id}>
                <TableCell>
                  <div className='font-medium'>{task.title}</div>
                  <div className='hidden text-sm text-muted-foreground md:inline'>
                    {task.description}
                  </div>
                </TableCell>
                <TableCell className='hidden xl:table-cell'>
                  {task.assigned_to.first_name} {task.assigned_to.last_name}
                </TableCell>
                <TableCell className='hidden xl:table-cell'>
                  <Badge className='text-xs' variant='outline'>
                    {task.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className='hidden md:table-cell lg:hidden xl:table-cell'>
                  {new Date(task.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className='text-right'>
                  {new Date(task.updated_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LeftCard;
