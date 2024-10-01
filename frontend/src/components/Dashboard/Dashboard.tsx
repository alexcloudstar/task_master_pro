import { FolderKanban, ListTodo, Users } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import useGetToken from '@/hooks/useGetToken';
import { getStats } from '@/services/users';
import { Loader } from '@/components/Loader';
import LeftCard from './LeftCard';
import RightCard from './RightCard';
import { TIcon } from '@/lib/types';

export const description =
  'An application shell with a header and main content area. The header has a navbar, a search input and and a user nav dropdown. The user nav is toggled by a button with an avatar image. The main content area is divided into two rows. The first row has a grid of cards with statistics. The second row has a grid of cards with a table of recent transactions and a list of recent sales.';

type TDashboardCardContent = {
  title: string;
  value: string;
  Icon: TIcon;
};

const Dashboard = () => {
  const token = useGetToken();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['stats'],
    queryFn: () => getStats({ token: token as string }),
    enabled: !!token,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error</div>;
  }

  const cardContent: TDashboardCardContent[] = [
    {
      title: 'Total Team Members',
      value: data?.users.toString() || '0',
      Icon: Users,
    },
    {
      title: 'Total Projects',
      value: data?.projects.toString() || '0',
      Icon: FolderKanban,
    },
    {
      title: 'Total Tasks',
      value: data?.tasks.toString() || '0',
      Icon: ListTodo,
    },
  ];

  return (
    <>
      <div className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 drop-shadow-md'>
        {cardContent.map(({ title, value, Icon }) => (
          <Card x-chunk='dashboard-01-chunk-0' key={uuid()}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>{title}</CardTitle>

              <Icon className='size-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className='grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 drop-shadow-md'>
        <LeftCard />
        <RightCard />
      </div>
    </>
  );
};

export default Dashboard;
