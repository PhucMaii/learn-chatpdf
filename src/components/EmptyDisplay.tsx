import Image from 'next/image';
import React from 'react';

interface IProps {
    src: string;
    text: string;
    width?: number;
    height?: number;
}

export default function EmptyDisplay({ src, text, width = 200, height = 200 }: IProps) {
  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <Image
        width={width}
        height={height}
        src={src}
        alt="Empty image"
        className="w-[200px] h-[200px]"
      />
      <h6 className="text-lg text-center text-gray-600">{text}</h6>
    </div>
  );
}
