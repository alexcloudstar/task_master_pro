import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';

const useGetToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const auth = useAuth();

  useEffect(() => {
    if (auth.isSignedIn) {
      auth.getToken().then((token) => setToken(token));
    }
  }, [auth]);

  return token;
};

export default useGetToken;
