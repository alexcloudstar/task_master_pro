import { useMutation } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { signup } from '@/services/auth';
import { useCookies } from 'react-cookie';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const Signup = () => {
  const formSchema = z.object({
    first_name: z.string().min(2).max(255),
    last_name: z.string().min(2).max(255),
    email_address: z.string().email(),
    password: z.string().min(8).max(255),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email_address: '',
      password: '',
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCookie] = useCookies(['token']);

  const mutation = useMutation({
    mutationFn: signup,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const token = await mutation.mutateAsync(values);

      setCookie('token', token, {
        path: '/',
        // 1 week
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
          name='email_address'
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
          Signup
        </Button>
      </form>
    </Form>
  );
};

export default Signup;
