import { UserButton } from '@clerk/nextjs';
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button';
import { auth } from '@clerk/nextjs/server';

type Props = {

}

const NavBar = async (props: Props) => {
    const {userId } = await auth();

  return (
    <div className="flex items-center justify-between">
        <div className='flex items-center gap-2'>
            <Link href={"/"}>
                <img src="images/logo.png" className="w-10 h-10 rounded-full"/>
            </Link>
          <h1 className="text-emerald-500 font-bold text-xl">LearnPDF</h1>
        </div>

        <div className="flex items-center gap-8 mr-2">
          <Link href='/dashboard' className="text-white font-semibold ">Dashboard</Link>
          <Link href='/dashboard' className="text-white font-semibold ">Pricing</Link>
          {userId ? <UserButton /> : <Button>Login</Button>}
        </div>
      </div>
  )
}

export default NavBar