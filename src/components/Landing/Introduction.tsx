'use client';
import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

export default function Introduction({ userId }: any) {
  const introVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: 'easeInOut',
      },
    }
  }

  return (
    <motion.div
      variants={introVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="2xl:max-w-(--breakpoint-2xl) 2xl:mx-auto mx-4 py-4 flex flex-col justify-center h-screen">
        {/* Headline */}
        <div className="w-full max-h-full flex flex-col items-center justify-center gap-8 mt-8">
          <div className="flex-1 flex flex-col items-center w-full">
            <h1 className="text-5xl max-w-4xl font-bold text-white text-center leading-[3.5rem]">
              Struggling to Study? <br />
              Get the help you need to pass with confidence!
            </h1>
            <h6 className="text-xl max-w-5xl text-gray-300 font-medium mt-2 text-center">
              Studying doesn&apos;t have to be stressful. Get quick answers,
              smart flashcards, and the support you need to stay on top of your
              game. With AI-powered tools and expert guidance, you&apos;ll study
              smarter, learn faster, and walk into your exam with confidence.
            </h6>
          </div>
          <div className="flex-1">
            <div className="w-full h-full bg-white"></div>
          </div>
        </div>
        <div className="flex flex-row justify-center">
          <Link href={`/chats`}>
            <Button className="mt-4 px-10 py-8 rounded-xl hover:bg-emerald-600 items-center focus:scale-98 transition-all duration-300">
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
    </motion.div>
  );
}
