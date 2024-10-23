'use client';
import FileUpload from '@/components/FileUpload';
import LoadingComponent from '@/components/LoadingComponent';
import NavBar from '@/components/NavBar';
import { checkSubscription } from '@/lib/subscription';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const CreateChat = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const checkProSubscription = async () => {
      setIsLoading(true);
      const fetchedSubscription = await checkSubscription(); // Wait for the async operation to complete

      if (!fetchedSubscription?.isAbleToAddMoreChats) {
        router.push('/pricing');
      }

      setIsLoading(false);
    };

    checkProSubscription(); // Call the async function

  }, []);

  return (
    <div className="p-8">
      <NavBar />

      {
        isLoading ? (
          <div className="w-full h-screen">
            <LoadingComponent />
          </div>
        ) : (
        <div className="flex flex-col items-center justify-center mt-32">
          <div className="flex flex-col items-center justify-center mt-8 gap-2 max-w-2xl">
            <h1 className="text-5xl font-bold text-center">Start a Chat</h1>
            <h6 className="text-xl font-semibold text-gray-400 text-center">
              Let&apos;s enhance your reading skills and learning experience with
              our AI-powered PDF reader.
            </h6>
            <div className="w-full mt-4">
              <FileUpload />
            </div>
          </div>
        </div>
        )
      }
    </div>
  );
};

export default CreateChat;
