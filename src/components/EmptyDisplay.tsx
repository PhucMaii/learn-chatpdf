import Image from 'next/image';
import React from 'react';

interface IProps {
    src: string;
    text: string;
}

export default function EmptyDisplay({ src, text }: IProps) {
  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <Image
        width={200}
        height={200}
        src={src}
        alt="Empty image"
        className="w-[200px] h-[200px]"
      />
      <h6 className="text-lg text-center text-gray-600">{text}</h6>
    </div>
  );
}
