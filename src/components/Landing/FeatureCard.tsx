import Image from 'next/image';
import React from 'react';

type Props = {
  card: any;
};

export default function FeatureCard({ card }: Props) {
  return (
    <div className="w-full h-full bg-white rounded-3xl p-6 flex flex-col items-center hover:scale-105 transition-all duration-500">
      <div className="relative w-full aspect-square h-[500px]">
        <Image
          src={card.image}
          alt={card.title}
          className="object-cover rounded-2xl"
          loading="eager"
          width={100}
          height={100}
          sizes="100vw"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>
      <div className="flex flex-col gap-4 text-center">
        <h2 className="text-3xl font-semibold">{card.title}</h2>
        <p className="text-lg font-medium text-gray-700">
          {card.description}
        </p>
      </div>
    </div>
  );
}
