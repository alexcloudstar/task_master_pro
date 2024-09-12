import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { SignedOut, useAuth, useSignIn } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { toast } from 'sonner';

const Login = () => {
  const { signIn } = useSignIn();
  const auth = useAuth();
  const search = useSearch({ from: '/auth' });

  const formSchema = z.object({
    email_address: z.string().email(),
    password: z.string().min(8).max(255),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email_address: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await signIn?.create({
        strategy: 'password',
        password: values.password,
        identifier: values.email_address,
      });

      if (res?.status === 'complete') {
        window.location.reload();
      }
    } catch {
      toast.error('Invalid email or password');
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isSignedIn) {
      navigate({
        // @ts-expect-error redirect exists
        to: search.redirect || '/_authenticated',
      });
    }
    // @ts-expect-error redirect exists
  }, [auth.isSignedIn, navigate, search.redirect]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
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
        <SignedOut>
          <Button type='submit' className='w-full'>
            Login
          </Button>
        </SignedOut>
      </form>
    </Form>
  );
};

export default Login;
