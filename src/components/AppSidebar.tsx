'use client';
import React, { useEffect, useState } from 'react';
import { tabs } from '@/lib/constant';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '@/lib/type';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from './ui/sidebar';
import { cn } from '@/lib/utils';
import Logo from './Landing/Logo';
import StatusText from './StatusText';

const AppSidebar = () => {
  const [user, setUser] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<number>(0);

  useEffect(() => {
    const path = window.location.pathname;
    const index = tabs.findIndex((tab) => tab.params === path.split('/')[1]);
    setSelectedTab(index);
  }, [window.location.pathname]);

  useEffect(() => {
    fetchUser();

    // const checkScreenSize = () => setSmDown(window.innerWidth < 640);
    // checkScreenSize();
    // window.addEventListener('resize', checkScreenSize);
    // return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_URL.USER}/get-user`);

      if (response.data.error) {
        toast.error('Something went wrong in fetching user');
        return;
      }

      setUser(response.data.user);
    } catch (error: any) {
      console.log('Internal Server Error: ', error);
    }
  };

  return (
    <SidebarProvider
    
    >
      <Sidebar collapsible='icon'>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo />
            <h6 className="text-xl font-semibold">LearnPDF</h6>
            <StatusText text={user?.status} type="info" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {tabs.map((tab, index) => (
                  <SidebarMenuItem
                    key={tab.title}
                    className={cn('font-semibold text-gray-400 p-1', {
                      'text-primary': index === selectedTab,
                    })}
                  >
                    <SidebarMenuButton asChild className="p-4 active:scale-90 transition-all duration-300">
                      <a href={tab.url}>
                        <tab.icon className="w-12 h-12" />
                        <span className="text-lg">{tab.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
    // <div className="w-full h-screen p-4 text-gray-200 bg-white">
    //   {/* Logo and user status */}
    //   <div className="flex items-center gap-2" onClick={() => router.push('/')}>
    //     <img src="images/logo.png" className="w-10 h-10 rounded-full" />
    //     <h1 className="text-black font-bold text-xl">LearnPDF</h1>
    //     <StatusText text={user?.status} type="info" />
    //   </div>

    //   {/* Navigation links */}
    //   <div className="flex flex-col gap-4 mt-4">
    //     {tabs.map((tab, index) => (
    //       <Link href={tab.link} key={index}>
    //         <div className="flex items-center gap-4 cursor-pointer hover:scale-102 transition-transform duration-200 ">
    //           <tab.icon
    //             className={cn('w-8 h-8 text-gray-400', {
    //               'text-emerald-500': index === selectedTab,
    //             })}
    //           />
    //           <h6
    //             className={cn('w-full text-lg font-semibold text-gray-400', {
    //               'text-emerald-500': index === selectedTab,
    //             })}
    //           >
    //             {tab.name}
    //           </h6>
    //         </div>
    //       </Link>
    //     ))}
    //   </div>
    // </div>
  );
};

export default AppSidebar;
