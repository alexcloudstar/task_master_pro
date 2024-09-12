import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useAuth, useSignUp } from '@clerk/clerk-react';
import { useEffect } from 'react';

const Signup = () => {
  const { signUp } = useSignUp();
  const auth = useAuth();
  const navigate = useNavigate();
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await signUp?.prepareVerification({
        strategy: 'email_code',
      });

      const res = await signUp?.create({
        firstName: values.first_name,
        lastName: values.last_name,
        emailAddress: values.email_address,
        password: values.password,
      });

      if (res?.status === 'complete') {
        window.location.reload();
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.errors[0].longMessage);
    }
  };

  useEffect(() => {
    if (auth.isSignedIn) {
      navigate({
        to: '/',
      });
    }
  }, [auth.isSignedIn, navigate]);

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
