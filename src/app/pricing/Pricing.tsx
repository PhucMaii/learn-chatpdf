'use client';
import NavBar from '@/components/NavBar';
import PricingCard from '@/components/PricingCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { pricingTabs } from '@/lib/constant';
import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const Pricing = () => {
  const [code, setCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [retrievedCode, setRetrievedCode] = useState<any>(null);
  const [isYearly, setIsYearly] = useState<boolean>(false);

  const handleGetCode = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/discount/get-code?code=${code}`);

      if (response.data.error) {
        toast.error('Code not found or already used');
        setIsLoading(false);
        return;
      }

      // setRetrievedCode(response.data.data);

      setIsLoading(false);
    } catch (error: any) {
      console.log('Internal Server Error: ', error);
      toast.error('Code not found or already used');
      setIsLoading(false);
    }
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: 'easeOut' },
    },
  };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible">
      <div className="p-4 md:p-8 w-screen ">
        <NavBar />

        <div className="w-full flex flex-col items-start justify-center mt-12">
          <div className="w-full flex items-center flex-col lg:flex-row">
            <div className="flex-1" />
            <div className="flex-1 flex flex-col gap-2">
              <h1 className="text-5xl font-bold text-center">
                Find Your Right Plan
              </h1>
              <h6 className="text-xl font-semibold text-gray-400 text-center">
                Our plans are designed to meet your needs.
              </h6>
            </div>
            <div className="flex-1 flex flex-col lg:flex-row justify-end lg:items-center gap-2">
              {/* <AddDiscountCode /> */}
              <h4 className="font-bold text-lg text-gray-500">Coupon Code</h4>
              <Input
                aria-label="Discount Code"
                placeholder="Enter code..."
                // className='w-full'
                className="w-fit"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <Button
                onClick={() => handleGetCode()}
                className="lg:w-fit w-full bg-blue-500 text-white font-bold text-md"
              >
                {isLoading ? 'Applying...' : 'Apply'}
              </Button>
            </div>
          </div>

          <div className="w-full flex items-center justify-center mt-8">
            <div className="relative w-[300px] h-[50px] border-2 border-gray-200 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "absolute top-0 left-0 w-1/2 h-full transition-all duration-300 ease-in-out",
                  isYearly ? "translate-x-full" : "translate-x-0"
                )}
              >
                <div className="absolute inset-0 bg-emerald-500" />
              </div>
              <div className="relative flex h-full">
                <button
                  onClick={() => setIsYearly(false)}
                  className={cn(
                    "flex-1 flex items-center justify-center transition-colors duration-300",
                    !isYearly ? "text-white" : "text-gray-400"
                  )}
                >
                  <h4 className="text-lg font-medium">Monthly</h4>
                </button>
                <button
                  onClick={() => setIsYearly(true)}
                  className={cn(
                    "flex-1 flex items-center justify-center transition-colors duration-300",
                    isYearly ? "text-white" : "text-gray-400"
                  )}
                >
                  <h4 className="text-lg font-medium">Yearly</h4>
                </button>
              </div>
            </div>
          </div>
          <div className="w-full flex items-center flex-col md:flex-row flex-wrap justify-center gap-8 mt-8">
            {pricingTabs.map((tab, index) => (
              <div key={index}>
                <PricingCard plan={tab} isYearly={isYearly} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Pricing;
