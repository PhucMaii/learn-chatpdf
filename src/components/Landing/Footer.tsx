import React from 'react'
import Logo from './Logo'
import { contactList } from '@/lib/constant'
import Link from 'next/link'

export default function Footer() {
  return (
    <div className="px-32 py-16">
        <div className="flex flex-row items-center justify-between max-w-4xl">
          <div className="flex flex-row gap-2 items-center">
            <Logo />
            <h6 className="text-xl font-bold text-white">LearnPDF</h6>
          </div>
          <div className="flex flex-col gap-4">
            {
              contactList.map((contact: any, index: number) => (
                <Link href={contact.link} className="flex flex-row gap-4 items-center" key={index}>
                  <contact.icon className="text-white" />
                  <h6 className="text-sm font-bold text-white">{contact.title}</h6>
                </Link>
              ))
            }
          </div>
        </div>
    </div>
  )
}
