import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export default function NavDialog({user}: any) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-black text-white font-semibold transition-all duration-300 hover:scale-102 hover:bg-black hover:text-white">
          <MenuIcon className="w-8 h-8 text-emerald-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full h-full bg-black transition-all duration-300">
        <div className="flex flex-col items-center gap-8 mr-2">
            {/* <Button onClick={() => onClose}>
                <X />
            </Button> */}
          <Link
            href="/chats"
            className={`text-white font-semibold hover:bg-gray-300 `}
          >
            Dashboard
          </Link>
          <Link
            href="/pricing"
            className={`text-white font-semibold `}
          >
            Pricing
          </Link>
          {user && Object.keys(user).length > 0 ? (
            <UserButton />
          ) : (
            <Link className="text-white hidden md:block" href="/sign-in">
              <Button className="rounded-xl font-semibold text-md">
                Login
              </Button>
            </Link>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
