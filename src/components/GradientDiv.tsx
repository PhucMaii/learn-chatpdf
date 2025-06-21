import React from 'react';

interface IProps {
  children: React.ReactNode;
  from: string;
  to: string;
  via: string;
  className?: string;
}

export default function GradientDiv({
  children,
  from,
  to,
  via,
  className,
}: IProps) {
  return (
    <div
      className={`flex flex-col gap-4 bg-gradient-to-r from-${from} via-${via} to-${to} p-4 rounded-lg ${className}`}
    >
      {children}
    </div>
  );
}
