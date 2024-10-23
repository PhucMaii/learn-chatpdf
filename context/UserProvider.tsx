import { DrizzleUser } from '@/lib/db/schema';
import React, { createContext, useState, ReactNode } from 'react';

type UserContextType = {
  user: DrizzleUser | null;
  setUser: React.Dispatch<React.SetStateAction<DrizzleUser | null>>;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<DrizzleUser | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
