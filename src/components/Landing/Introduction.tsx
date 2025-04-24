'use client';
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import GuestFileUpload from './GuestFileUpload';
import { UserContext } from '../../../context/UserProvider';
import { useRouter } from 'next/navigation';
import { Skeleton } from '../ui/skeleton';

export default function Introduction() {
  const { user, isInitializing }: any = useContext(UserContext);
  const router = useRouter();

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

  if (isInitializing) {
    return <motion.div>
      <Skeleton />
    </motion.div>
  }

  return (
    <motion.div variants={introVariants} initial="hidden" animate="visible">
      <div className="w-full 2xl:mx-auto mx-4 py-4 flex flex-col justify-center items-center h-full mt-8 md:mt-0">
        {/* Headline */}
        <div className="w-full max-h-full flex items-center md:flex-row flex-col justify-center gap-8 mt-8">
          <div className="flex-1 flex flex-col w-full">
            <h1 className="text-6xl max-w-4xl font-bold text-center md:text-left leading-[4.5rem]">
              Study Smarter,
              <br />
              Not Harder
            </h1>
            <h6 className="text-xl max-w-5xl font-medium mt-2 text-center md:text-left">
              Study made simple. Learn faster, <br />
              stress less, and feel confident <br />
              with LearnPDF
            </h6>
            <Button className="mt-4 py-6 px-8 rounded-xl font-semibold text-xl w-[300px] mx-auto md:mx-0 mt-8" onClick={() => {
              if (user?.status) {
                router.push('/projects');
              } else {
                router.push('/sign-up');
              }
            }}>
              {user?.status ? 'Go to Dashboard' : 'Sign Up For Free'}
            </Button>
            {!user?.status && (
              <div className="w-[300px] h-full mx-auto md:mx-0">
                <GuestFileUpload className="w-full" projectId={1} />
              </div>
            )}
            <div className="flex flex-col justify-center mt-8"></div>
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
      </div>
    </motion.div>
  );
}
