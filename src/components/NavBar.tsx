'use client';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import React, { useContext } from 'react';
import { Button } from './ui/button';
import { UserContext } from '../../context/UserProvider';
import NavDialog from './Dialogs/NavDialog';

type Props = {
  landingPage?: boolean;
};

const NavBar = ({ landingPage }: Props) => {
  const { user }: any = useContext(UserContext);

  return (
    <div className="flex items-center justify-between px-8 w-full">
      <div className="flex items-center gap-2">
        <Link href={'/'}>
          <img src="images/logo.png" className="w-10 h-10 rounded-full" />
        </Link>
        <h1 className="text-emerald-500 font-bold text-xl">LearnPDF</h1>
      </div>

      <div className="md:hidden flex">
        {/* <MenuIcon className="w-8 h-8 text-emerald-500" /> */}
        <NavDialog user={user} />
      </div>

      <div className="hidden md:flex items-center gap-8 mr-2">
        <Link
          href="/chats"
          className={`${landingPage ? 'text-white' : 'text-emerald-500'} font-semibold `}
        >
          Dashboard
        </Link>
        <Link
          href="/pricing"
          className={`${landingPage ? 'text-white' : 'text-emerald-500'} font-semibold hidden sm:block `}
        >
          Pricing
        </Link>
        {user && Object.keys(user).length > 0 ? (
          <UserButton />
        ) : (
          <Link className="text-white hidden md:block" href="/sign-in">
            <Button className="rounded-xl font-semibold text-md">Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavBar;
