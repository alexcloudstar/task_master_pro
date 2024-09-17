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
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useGetToken from '@/hooks/useGetToken';
import { postProject } from '@/services/projects';
import { TCreateProject } from '@/services/projects/post';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const Add = () => {
  const token = useGetToken();

  const formSchema = z.object({
    title: z.string().min(2).max(255),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (values: TCreateProject) =>
      postProject({ token: token as string, createdProject: values }),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newProject: TCreateProject = {
      title: values.title,
      description: '',
      color: '#000000',
      created_by_id: 1,
      created_at: new Date(),
      updated_at: new Date(),
    };

    try {
      await mutation.mutateAsync(newProject);
      form.reset();
      toast.success('Project created successfully');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className='flex items-center justify-between'>
      <div>
        <h1 className='text-xl font-semibold'>Projects</h1>
      </div>
      <div>
        <AlertDialog>
          <Button>
            <AlertDialogTrigger>
              <Plus />
            </AlertDialogTrigger>
          </Button>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add a new Project</AlertDialogTitle>
              <AlertDialogDescription>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    id='create_project'
                  >
                    <FormField
                      control={form.control}
                      name='title'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Title</FormLabel>
                          <FormControl>
                            <Input placeholder='shadcn' {...field} />
                          </FormControl>
                          <FormDescription>
                            This is your public display name.
                          </FormDescription>
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
              <Button type='submit' form='create_project'>
                <AlertDialogAction>Add</AlertDialogAction>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Add;
