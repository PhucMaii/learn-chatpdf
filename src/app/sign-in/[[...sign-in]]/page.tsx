'use client';
import { SignIn } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import { UserContext } from '../../../../context/UserProvider';
import { useContext, useEffect } from 'react';

export default function Page() {
  const { isSignedIn, user } = useUser();
  const { setUser }: any = useContext(UserContext);

  useEffect(() => {
    if (isSignedIn && user) {
      setUser(user);
    }
  }, [isSignedIn, user]);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <SignIn />
    </div>
  );
}
