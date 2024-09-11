import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';

const Auth = () => {
  const formSchema = z.object({
    first_name: z.string().min(2).max(255),
    last_name: z.string().min(2).max(255),
    email: z.string().email(),
    password: z.string().min(8).max(255),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div className='w-full lg:grid lg:min-h-[600px] xl:min-h-[800px] h-[calc(100%-24px)]'>
      <div className='flex items-center justify-center py-12'>
        <div className='mx-auto grid w-[350px] gap-6'>
          <div className='grid gap-2 text-center'>
            <h1 className='text-3xl font-bold'>Login</h1>
            <p className='text-balance text-muted-foreground'>
              Enter your email below to login to your account
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
              <FormField
                control={form.control}
                name='first_name'
                render={({ field }) => (
                  <FormItem className='grid gap-2'>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder='John' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='last_name'
                render={({ field }) => (
                  <FormItem className='grid gap-2'>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Doe' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='grid gap-2'>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='john@doe.com' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='grid gap-2'>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type='password' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full'>
                Login
              </Button>
              <Button variant='outline' className='w-full'>
                Login with Google
              </Button>
            </form>
          </Form>
          <div className='mt-4 text-center text-sm'>
            Don&apos;t have an account?{' '}
            <a href='#' className='underline'>
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute('/auth')({
  component: Auth,
});
