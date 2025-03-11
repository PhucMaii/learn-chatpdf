import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Introduction({ userId }: any) {
  return (
    <div className="2xl:max-w-(--breakpoint-2xl) 2xl:mx-auto mx-4 py-4 flex flex-col justify-center h-screen">
      {/* Headline */}
      <div className="w-full max-h-full flex flex-col items-center justify-center gap-8 mt-8">
        <div className="flex-1 flex flex-col items-center w-full">
          <h1 className="text-5xl font-bold text-white text-center">
            Enhance Your Learning Experience Today
          </h1>
          <h6 className="text-xl text-gray-300 font-semibold mt-2 text-center">
            Say goodbye to bad marks and hello to incredible results in marks
            with our innovative AI app, designed to retrieve information <br />
            faster, boost productivity, save reading time and help students
            achieve academic success effortlessly.
          </h6>
        </div>
        <div className="flex-1">
          <div className="w-full h-full bg-white"></div>
        </div>
      </div>
      <div className="flex flex-row justify-center">
        <Link href={`/chats`}>
          <Button className="mt-4 px-12 py-10 rounded-xl hover:bg-primary-500 items-center">
            <h1 className="text-2xl text-white font-semibold">
              {userId ? 'Go To Chats' : 'Start Free Trial'}
            </h1>
          </Button>
        </Link>
      </div>

      {/* Users */}
      <div className="flex flex-row items-center justify-center gap-2 mt-6">
        <div className="flex -space-x-4 items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://media.licdn.com/dms/image/v2/D5603AQH7n4x0Nf3yuA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1706312871768?e=1733961600&v=beta&t=_DLvQr4y60b3eptGXHwN-Bx1ByP96vpKmkMAZJXlVVM" />
            <AvatarFallback>PM</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://lh3.googleusercontent.com/a/ACg8ocIztMgDplLlj7Ysy9msvSyNloM6m9h3pkzL3BtJyqXNpO2j8A=s576-c-no" />
            <AvatarFallback>DP</AvatarFallback>
          </Avatar>
          <div className="w-10 h-10 rounded-full bg-indigo-200 z-10 text-black text-center flex items-center justify-center">
            99+
          </div>
        </div>

        <h4 className="text-white font-semibold">
          99+ users have leveled up their learning experience
        </h4>
      </div>
    </div>
  );
}
