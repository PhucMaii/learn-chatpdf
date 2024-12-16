import Image from 'next/image';
import React from 'react';

type Props = {
    card: any
}

export default function FeatureCard({card}: Props) {
  return (
    <div className="w-full h-full bg-white p-4 rounded-3xl border-2 border-gray-300 flex flex-col items-center justify-center gap-4">
        <h6 className="text-2xl font-bold">{card.title}</h6>
        <Image src={card.image} alt={card.title} width={300} height={500} className='rounded-3xl' />
        <h6 className="text-lg font-bold text-center text-gray-500">{card.description}</h6>
    </div>
  )
}
