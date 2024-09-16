import { DollarSign } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import useGetToken from '@/hooks/useGetToken';
import { getStats } from '@/services/users';
import { Loader } from '@/components/Loader';
import LeftCard from './LeftCard';

export const description =
  'An application shell with a header and main content area. The header has a navbar, a search input and and a user nav dropdown. The user nav is toggled by a button with an avatar image. The main content area is divided into two rows. The first row has a grid of cards with statistics. The second row has a grid of cards with a table of recent transactions and a list of recent sales.';

type TDashboardCardContent = {
  title: string;
  value: string;
  description: string;
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
      description: '+3 from last month',
    },
    {
      title: 'Total Projects',
      value: data?.projects.toString() || '0',
      description: '+1 from last month',
    },
    {
      title: 'Total Sprints',
      value: data?.sprints.toString() || '0',
      description: '+2 from last month',
    },
    {
      title: 'Total Tasks',
      value: data?.tasks.toString() || '0',
      description: '+20 from last month',
    },
  ];

  return (
    <>
      <div className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 drop-shadow-md'>
        {cardContent.map((content) => (
          <Card x-chunk='dashboard-01-chunk-0' key={uuid()}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {content.title}
              </CardTitle>
              <DollarSign className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{content.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className='grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 drop-shadow-md'>
        <LeftCard />
        <Card x-chunk='dashboard-01-chunk-5'>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-8'>
            <div className='flex items-center gap-4'>
              <Avatar className='hidden h-9 w-9 sm:flex'>
                <AvatarImage src='/avatars/01.png' alt='Avatar' />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div className='grid gap-1'>
                <p className='text-sm font-medium leading-none'>
                  Olivia Martin
                </p>
                <p className='text-sm text-muted-foreground'>
                  olivia.martin@email.com
                </p>
              </div>
              <div className='ml-auto font-medium'>+$1,999.00</div>
            </div>
            <div className='flex items-center gap-4'>
              <Avatar className='hidden h-9 w-9 sm:flex'>
                <AvatarImage src='/avatars/02.png' alt='Avatar' />
                <AvatarFallback>JL</AvatarFallback>
              </Avatar>
              <div className='grid gap-1'>
                <p className='text-sm font-medium leading-none'>Jackson Lee</p>
                <p className='text-sm text-muted-foreground'>
                  jackson.lee@email.com
                </p>
              </div>
              <div className='ml-auto font-medium'>+$39.00</div>
            </div>
            <div className='flex items-center gap-4'>
              <Avatar className='hidden h-9 w-9 sm:flex'>
                <AvatarImage src='/avatars/03.png' alt='Avatar' />
                <AvatarFallback>IN</AvatarFallback>
              </Avatar>
              <div className='grid gap-1'>
                <p className='text-sm font-medium leading-none'>
                  Isabella Nguyen
                </p>
                <p className='text-sm text-muted-foreground'>
                  isabella.nguyen@email.com
                </p>
              </div>
              <div className='ml-auto font-medium'>+$299.00</div>
            </div>
            <div className='flex items-center gap-4'>
              <Avatar className='hidden h-9 w-9 sm:flex'>
                <AvatarImage src='/avatars/04.png' alt='Avatar' />
                <AvatarFallback>WK</AvatarFallback>
              </Avatar>
              <div className='grid gap-1'>
                <p className='text-sm font-medium leading-none'>William Kim</p>
                <p className='text-sm text-muted-foreground'>will@email.com</p>
              </div>
              <div className='ml-auto font-medium'>+$99.00</div>
            </div>
            <div className='flex items-center gap-4'>
              <Avatar className='hidden h-9 w-9 sm:flex'>
                <AvatarImage src='/avatars/05.png' alt='Avatar' />
                <AvatarFallback>SD</AvatarFallback>
              </Avatar>
              <div className='grid gap-1'>
                <p className='text-sm font-medium leading-none'>Sofia Davis</p>
                <p className='text-sm text-muted-foreground'>
                  sofia.davis@email.com
                </p>
              </div>
              <div className='ml-auto font-medium'>+$39.00</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
