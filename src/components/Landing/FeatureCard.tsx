import Image from 'next/image';
import React from 'react';

type Props = {
  card: any;
};

export default function FeatureCard({ card }: Props) {
  return (
    <div className="w-full h-full bg-white  flex flex-col items-center justify-center gap-4 hover:scale-103 transition-all duration-500">
      <Image
        src={card.image}
        alt={card.title}
        width={300}
        height={500}
        className="rounded-3xl"
      />
      <div className="flex flex-col justify-center gap-4">
        <h6 className="text-4xl text-left font-semibold">{card.title}</h6>
        <h6 className="text-lg text-left font-medium text-gray-700">
          {card.description}
        </h6>
      </div>
    </div>
  );
}
