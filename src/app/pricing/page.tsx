'use client';
import NavBar from '@/components/NavBar';
import PricingCard from '@/components/PricingCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { pricingTabs } from '@/lib/constant';
import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Pricing = () => {
  const [code, setCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [retrievedCode, setRetrievedCode] = useState<any>(null);

  const handleGetCode = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/discount/get-code?code=${code}`);

      if (response.data.error) {
        toast.error('Error fetching discount code: ' + response.data.error);
        setIsLoading(false);
        return;
      }

      setRetrievedCode(response.data.data);

      setIsLoading(false);
    } catch (error: any) {
      console.log('Internal Server Error: ', error);
      toast.error('Something went wrong: ' + error?.response?.data?.error);
      setIsLoading(false);
    }
  }

  return (
    <div className="p-8 w-screen">
      <NavBar />

      <div className="w-full flex flex-col items-start justify-center mt-12">
        <div className="w-full flex items-center">
          <div className="flex-[1]" />
          <div className="flex-[1] flex flex-col gap-2">
            <h1 className="text-5xl font-bold text-center">Find Your Right Plan</h1>
            <h6 className="text-xl font-semibold text-gray-400 text-center">
              Our plans are designed to meet your needs.
            </h6>
          </div>
          <div className="flex-[1] flex justify-end items-center gap-2">
            {/* <AddDiscountCode /> */}
            <h4 className="font-bold text-lg text-gray-500">Coupon Code</h4>
            <Input 
              aria-label='Discount Code'
              placeholder='Enter code...'
              // className='w-full'
              className="w-fit"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button onClick={() => handleGetCode()} className='w-fit bg-blue-500 text-white font-bold text-md'>
              {isLoading ? 'Applying...' : 'Apply'}
            </Button>

          </div>
        </div>

        <div className="w-full flex items-center justify-center gap-8 mt-8">
          {pricingTabs.map((tab, index) => (
            <PricingCard
              key={index}
              price={tab.price}
              title={tab.title}
              isPopular={tab.isPopular}
              plan={tab.plan}
              save={tab.save}
              discount={retrievedCode}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
