import NavBar from '@/components/NavBar';
import PricingCard from '@/components/PricingCard';
import { pricingTabs } from '@/lib/constant';
import React from 'react';

const Pricing = () => {
  return (
    <div className="p-8 w-screen">
      <NavBar />

      <div className="w-full flex flex-col items-center justify-center mt-12">
        <h1 className="text-5xl font-bold text-center">Find Your Right Plan</h1>
        <h6 className="text-xl font-semibold text-gray-400 text-center">
          Our plans are designed to meet your needs.
        </h6>

        <div className="w-full flex items-center justify-center gap-8 mt-8">
          {pricingTabs.map((tab, index) => (
            <PricingCard
              key={index}
              price={tab.price}
              title={tab.title}
              isPopular={tab.isPopular}
              plan={tab.plan}
              save={tab.save}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
