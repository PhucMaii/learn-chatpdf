import Image from 'next/image';
import React from 'react';

type Props = {
  card: any;
};

export default function FeatureCard({ card }: Props) {
  return (
    <div className="w-full h-full bg-white rounded-3xl p-6 flex flex-col items-center hover:scale-[1.02] transition-all duration-300">
      <div className="relative w-full aspect-square h-[500px]">
        <Image
          src={card.image}
          alt={card.title}
          className="object-cover rounded-2xl"
          loading="lazy"
          width={400}
          height={400}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={85}
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
