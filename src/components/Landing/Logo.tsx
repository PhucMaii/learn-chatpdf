import Link from 'next/link'
import React from 'react'

export default function Logo() {
  return (
    <Link href={'/'}>
        <img src="/images/logo.png" className="w-10 h-10 rounded-full" />
    </Link>
  )
}
