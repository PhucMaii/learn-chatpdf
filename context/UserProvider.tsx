import { DrizzleUser } from '@/lib/db/schema';
import { API_URL } from '@/lib/type';
import axios from 'axios';
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import toast from 'react-hot-toast';

type UserContextType = {
  user: DrizzleUser | null;
  setUser: React.Dispatch<React.SetStateAction<DrizzleUser | null>>;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

type Props = {
  children: ReactNode;
};

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<DrizzleUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL.USER}/get-user`);

        if (response.data.error) {
          toast.error('Error fetching user: ' + response.data.error);
          return;
        }

        setUser(response.data.user);
      } catch (error: any) {
        console.log('Internal Server Error: ', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
