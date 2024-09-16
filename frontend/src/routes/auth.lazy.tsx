import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import Login from '@/components/Auth/Login';
import Signup from '@/components/Auth/Signup';
import { useAuth } from '@clerk/clerk-react';
import { Loader } from '@/components/Loader';

const Auth = () => {
  const auth = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  const toggleIsLogin = () => setIsLogin(!isLogin);

  if (!auth.isLoaded) {
    return <Loader />;
  }

  return (
    <div className='w-full lg:grid lg:min-h-[600px] xl:min-h-[800px] h-[calc(100%-24px)]'>
      <div className='flex items-center justify-center py-12'>
        <div className='mx-auto grid w-[350px] gap-6'>
          <div className='grid gap-2 text-center'>
            <h1 className='text-3xl font-bold'>
              {isLogin ? 'Login' : 'Sign Up'}
            </h1>
            <p className='text-balance text-muted-foreground'>
              Enter your email below to {isLogin ? 'login' : 'signup'} to your
              account
            </p>
          </div>
          {isLogin ? <Login /> : <Signup />}
          <div className='mt-4 text-center text-sm'>
            Don&apos;t have an account?{' '}
            <button type='button' className='underline' onClick={toggleIsLogin}>
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute('/auth')({
  component: Auth,
});
