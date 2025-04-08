import React from 'react';

interface IProps {
    src: string;
    text: string;
}

export default function EmptyDisplay({ src, text }: IProps) {
  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <img
        width={200}
        height={200}
        src={src}
        alt=""
        className="w-[200px] h-[200px]"
      />
      <h6 className="text-lg text-gray-600">{text}</h6>
    </div>
  );
}
