import { DrizzleUser } from '@/lib/db/schema';
import { API_URL } from '@/lib/type';
import axios from 'axios';
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import toast from 'react-hot-toast';

type UserContextType = {
  user: DrizzleUser | null;
  isInitializing: boolean;
  setUser: React.Dispatch<React.SetStateAction<DrizzleUser | null>> | null;
};

export const UserContext = createContext<UserContextType | undefined>({
  user: null,
  isInitializing: true,
  setUser: null
});

type Props = {
  children: ReactNode;
};

export const UserProvider = ({ children }: Props) => {
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [user, setUser] = useState<DrizzleUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL.USER}/get-user`);

        if (response.data.error) {
          toast.error('Error fetching user: ' + response.data.error);
          setUser(null);
          return;
        }

        setUser(response.data.user);
      } catch (error: any) {
        console.log('Internal Server Error: ', error);
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isInitializing, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
