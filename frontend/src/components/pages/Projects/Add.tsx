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
import useGetToken from '@/hooks/useGetToken';
import { updateOrCreateProject } from '@/services/projects';
import { TInsertProject } from '@/services/projects/types';
import { getMe } from '@/services/users';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const Add = () => {
  const token = useGetToken();

  const formSchema = z.object({
    title: z.string().min(2).max(255),
    description: z.string().min(2).max(255),
    color: z.string().min(2).max(255),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      color: '',
    },
  });

  const queryClient = useQueryClient();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['me'],
    queryFn: () => getMe({ token: token as string }),
    enabled: !!token,
  });

  const mutation = useMutation({
    mutationFn: (values: TInsertProject) =>
      updateOrCreateProject({
        token: token as string,
        createdProject: values,
        isCreating: true,
      }),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newProject: TInsertProject = {
      ...values,
      created_by_id: data?.id ?? -1,
      created_at: new Date(),
      updated_at: new Date(),
    };

    try {
      await mutation.mutateAsync(newProject);
      form.reset();
      toast.success('Project created successfully');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>There was an error</div>;
  }

  return (
    <div className='flex items-center justify-between'>
      <div>
        <h1 className='text-xl font-semibold'>Projects</h1>
      </div>
      <div>
        <AlertDialog>
          <AlertDialogTrigger className='bg-sky-500 px-4 py-2 rounded-md text-white'>
            <Plus />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add a new Project</AlertDialogTitle>
              <AlertDialogDescription>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    id='create_project'
                    className='space-y-4'
                  >
                    <FormField
                      control={form.control}
                      name='title'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project title</FormLabel>
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
                          <FormLabel>Project description</FormLabel>
                          <FormControl>
                            <Input placeholder='Project for...' {...field} />
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
                          <FormLabel>Project color</FormLabel>
                          <FormControl>
                            <Input type='color' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction type='submit' form='create_project'>
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
