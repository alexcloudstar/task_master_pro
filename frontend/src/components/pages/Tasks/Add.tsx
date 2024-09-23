import { Loader } from '@/components/Loader';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
import { postTask } from '@/services/tasks';
import { TCreateTask } from '@/services/tasks/post';
import { ETaskStatus, TTask } from '@/services/tasks/types';
import { getMe, getUsers } from '@/services/users';
import { TUser } from '@/services/users/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const Add = ({ selectedTaskId }: { selectedTaskId: TTask['id'] }) => {
  const token = useGetToken();

  const formSchema = z.object({
    title: z.string().min(2).max(255),
    description: z.string().min(2).max(255),
    color: z.string().min(2).max(255),
    status: z.string().min(2).max(255),
    project_id: z.number(),
    assigned_to_id: z.number(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      color: '',
      status: '',
      project_id: 0,
      assigned_to_id: 0,
    },
  });

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const onChange = (value: string) => {
    setSelectedUserId(parseInt(value, 10));
  };

  const queryClient = useQueryClient();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['me'],
    queryFn: () => getMe({ token: token as string }),
    enabled: !!token,
  });

  const {
    isLoading: isLoadingGetUsers,
    isError: isErrorGetUsers,
    data: getUsersData,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers({ token: token as string }),
    enabled: !!token,
  });

  const mutation = useMutation({
    mutationFn: (values: TCreateTask) =>
      postTask({ token: token as string, createdTask: values }),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    if (!selectedUserId || !getUsersData?.length) {
      return;
    }

    const newTask: TCreateTask = {
      ...values,
      project_id: selectedTaskId,
      assigned_to_id: selectedUserId,
      created_by_id: data?.id ?? -1,
      assigned_to: getUsersData?.find(
        (user) => user.id === selectedUserId,
      ) as TUser,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      await mutation.mutateAsync(newTask);
      form.reset();
      toast.success('Task created successfully');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (isLoading || isLoadingGetUsers) {
    return <Loader />;
  }

  if (isError || isErrorGetUsers) {
    return <div>There was an error</div>;
  }

  // TODO: Status is ""

  console.log(form.formState.errors);
  console.log(form.getValues());

  return (
    <div className='flex items-center justify-between'>
      <div>
        <AlertDialog>
          <AlertDialogTrigger className='bg-sky-500 px-4 py-2 rounded-md text-white'>
            <Plus />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add a new Task</AlertDialogTitle>
              <AlertDialogDescription>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    id='create_task'
                    className='space-y-4'
                  >
                    <FormField
                      control={form.control}
                      name='title'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Task title</FormLabel>
                          <FormControl>
                            <Input placeholder='shadcn' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='description'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Task description</FormLabel>
                          <FormControl>
                            <Input placeholder='Task description' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='color'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Task color</FormLabel>
                          <FormControl>
                            <Input type='color' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Select>
                      <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          {(
                            Object.keys(ETaskStatus) as Array<
                              keyof typeof ETaskStatus
                            >
                          ).map((status) => (
                            <SelectItem
                              key={status}
                              value={status}
                              className='capitalize'
                            >
                              {status.toLowerCase().replace('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Select onValueChange={onChange}>
                      <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Select a user' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Assign to</SelectLabel>
                          {getUsersData?.map((user) => (
                            <SelectItem
                              key={user.id}
                              value={user.id.toString()}
                            >
                              {user.first_name} {user.last_name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <button type='submit' form='create_task'>
                      Add
                    </button>
                  </form>
                </Form>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction type='submit' form='create_task'>
                Add
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Add;
