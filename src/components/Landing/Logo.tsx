import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Logo() {
  return (
    <Link href={'/'}>
      <Image
        alt="logo"
        src="/images/logo.png"
        className="w-10 h-10 rounded-full"
        loading="eager"
        width={40}
        height={40}
      />
    </Link>
  );
}
