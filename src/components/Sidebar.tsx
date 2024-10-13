'use client';

import React, { useEffect, useState } from 'react'
import StatusText from './StatusText'
import Link from 'next/link';
import { tabs } from '@/lib/constant';
import { cn } from '@/lib/utils';

const Sidebar = () => {
    const [selectedTab, setSelectedTab] = useState<number>(0);

    useEffect(() => {
        const path = window.location.pathname;
        const index = tabs.findIndex(tab => tab.link === path);
        setSelectedTab(index);
    }, [window.location.pathname]);
  return (
    <div className="w-full h-screen p-4 text-gray-200 bg-white">
        {/* Logo and user status */}
        <div className="flex items-center gap-2">
            <img src="images/logo.png" className="w-10 h-10 rounded-full"/>
            <h1 className="text-black font-bold text-xl">LearnPDF</h1>
            <StatusText text="Beta" type="info" />
        </div>

        {/* Navigation links */}
        <div className="flex flex-col gap-4 mt-4">
            {
                tabs.map((tab, index) => (
                    <Link href={tab.link} key={index}>
                        <div className="flex items-center gap-4">
                            <tab.icon className={cn('w-8 h-8 text-gray-400', {'text-emerald-500': index === selectedTab})} />
                            <h6 className={cn("w-full text-lg font-semibold text-gray-400", {"text-emerald-500": index === selectedTab})}>{tab.name}</h6>
                        </div>
                    </Link>
                ))
            }
        </div>
    </div>
  )
}

export default Sidebar