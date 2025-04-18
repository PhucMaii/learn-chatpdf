'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

export default function Introduction() {
  const introVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div variants={introVariants} initial="hidden" animate="visible">
      <div className="2xl:max-w-(--breakpoint-2xl) 2xl:mx-auto mx-4 py-4 flex flex-col justify-center h-screen">
        {/* Headline */}
        <div className="w-full max-h-full flex items-center sm:flex-row flex-col justify-center gap-8 mt-8">
          <div className="flex-1 flex flex-col w-full">
            <h1 className="text-6xl max-w-4xl font-bold text-center sm:text-left leading-[4.5rem]">
              Study Smarter,
              <br />
              Not Harder
            </h1>
            <h6 className="text-xl max-w-5xl font-medium mt-2 text-center sm:text-left">
              Study made simple. Learn faster, <br />
              stress less, and feel confident <br />
              with LearnPDF
            </h6>
            <Button className="mt-4 py-6 px-8 rounded-xl font-semibold text-xl w-fit mt-8">
              Start Your Free Trial
            </Button>
          </div>
          <div className="flex-1">
            <img
              src="/images/learning.png"
              alt="learning"
              className="w-full h-full"
              width={500}
              height={500}
            />
          </div>
        </div>

        {/* Users */}
        {/* <div className="flex flex-row items-center justify-center gap-2 mt-2">
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
        </div> */}

        {/* <div className="flex flex-col justify-center mt-8">
          <div className="w-4xl mx-auto h-full px-4">
            <FileUpload
              className="mt-4"
              noIncludeLink
              msg="Drop Your File Here and See The Magic Happens"
            />
          </div>
        </div> */}
      </div>
    </motion.div>
  );
}
