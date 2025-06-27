import Image from 'next/image';
import React from 'react';

interface IProps {
  text: string;
}

export default function GeneratingDisplay({ text }: IProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
    <Image
      src="/images/generating.png"
      alt="loading"
      width={500}
      height={500}
      loading="lazy"
    />
    <h1 className="text-lg text-center text-gray-600">
      {text}
    </h1>
  </div>
  )
}