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
} from '@/components/ui/alert-dialog';
import useGetToken from '@/hooks/useGetToken';
import { getProject, updateOrCreateProject } from '@/services/projects';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useEffect } from 'react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { TInsertProject } from '@/services/projects/types';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { UploadFile } from '@/components/UploadFile';
import { uploadAssets } from '@/services/files';
import { Assets } from '@/components/Assets';

type TDetailsProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  projectId: number;
};

const Details = ({ isOpen, setIsOpen, projectId }: TDetailsProps) => {
  const token = useGetToken();

  const formSchema = z.object({
    title: z.string().min(2).max(255),
    description: z.string(),
    color: z.string().min(2).max(255),
  });

  const queryClient = useQueryClient();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['project'],
    queryFn: () => getProject({ token: token as string, id: projectId }),
    enabled: !!token && !!projectId,
  });

  const mutationUpdateProjectData = useMutation({
    mutationFn: (values: TInsertProject) =>
      updateOrCreateProject({
        token: token as string,
        createdProject: values,
        isCreating: false,
      }),
  });

  const mutationUploadFile = useMutation({
    mutationFn: (fileFormData: FormData) =>
      uploadAssets({
        token: token as string,
        folder: data?.title ?? 'uncategorized',
        formData: fileFormData,
      }),
  });

  const isLoadingData =
    mutationUpdateProjectData.isPending ||
    isLoading ||
    mutationUploadFile.isPending;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newProject: TInsertProject = {
      ...values,
      id: data?.id,
      created_at: new Date(),
      updated_at: new Date(),
    };

    try {
      await mutationUpdateProjectData.mutateAsync(newProject);

      queryClient.invalidateQueries({
        queryKey: ['projects'],
      });
      toast.success('Project updated successfully');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      color: '',
      description: '',
    },
  });

  useEffect(() => {
    if (data) {
      form.setValue('title', data.title);
      form.setValue('description', data.description);
      form.setValue('color', data.color);
    }
  }, [data, form]);

  if (isLoadingData) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className='lg:max-w-[900px]'>
        <AlertDialogHeader>
          <AlertDialogTitle>{data?.title}</AlertDialogTitle>
          <AlertDialogDescription className='space-y-4'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
                id='update_project'
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
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            <UploadFile mutation={mutationUploadFile} />
            <Assets projectName={data?.title ?? 'uncategorized'} />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isLoadingData}
            className={isLoadingData ? 'cursor-not-allowed' : ''}
          >
            {mutationUploadFile.isPending ? (
              <ReloadIcon className='mr-2 size-4 animate-spin' />
            ) : (
              'Cancel'
            )}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoadingData}
            className={isLoadingData ? 'cursor-not-allowed' : ''}
            form='update_project'
            type='submit'
          >
            {mutationUploadFile.isPending ? (
              <ReloadIcon className='mr-2 size-4 animate-spin' />
            ) : (
              'Save'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Details;
