import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { auth } from '@clerk/nextjs/server';

type Props = {
  landingPage?: boolean;
};

const NavBar = async ({ landingPage }: Props) => {
  const { userId } = await auth();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link href={'/'}>
          <img src="images/logo.png" className="w-10 h-10 rounded-full" />
        </Link>
        <h1 className="text-emerald-500 font-bold text-xl">LearnPDF</h1>
      </div>

      <div className="flex items-center gap-8 mr-2">
        <Link
          href="/chats"
          className={`${landingPage ? 'text-white' : 'text-emerald-500'} font-semibold `}
        >
          Dashboard
        </Link>
        <Link
          href="/pricing"
          className={`${landingPage ? 'text-white' : 'text-emerald-500'} font-semibold `}
        >
          Pricing
        </Link>
        {userId ? (
          <UserButton />
        ) : (
          <Link href="/sign-in">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavBar;
