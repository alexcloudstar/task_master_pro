import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { useCookies } from "react-cookie";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SignedOut, useAuth, useSignIn } from "@clerk/clerk-react";
import { useCallback, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

const Login = () => {
    const {signIn, isLoaded } = useSignIn();
    const auth = useAuth();


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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCookie] = useCookies(['token']);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const res = await signIn?.create({
            strategy: 'password',
            password: values.password,
            identifier: values.email_address,
        });

        if(res?.status === 'complete') {
            window.location.reload();
        }
  };

    const setToken = useCallback(async () => {
        const token = await auth.getToken();
        console.log(token);
        setCookie('token', token, { path: '/' });
    }, [auth, setCookie]);

    const navigate = useNavigate();

    useEffect(() => {
        if(isLoaded) {
            setToken();
        }

        if(auth.isSignedIn) {
            navigate({
                to: '/',
            });
        }
    }, [auth.isSignedIn, isLoaded, navigate, setToken]);

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
    )
}

export default Login;
