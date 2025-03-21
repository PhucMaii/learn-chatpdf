'use client';

import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar';
import { tabs } from '@/lib/constant';
import Logo from './Landing/Logo';
import StatusText from './StatusText';
import axios from 'axios';
import { API_URL } from '@/lib/type';
import toast from 'react-hot-toast';

export function AppSidebar() {
  const [user, setUser] = React.useState<any>(null);

  // React.useEffect(() => {
  //   const path = window.location.pathname;
  //   const index = tabs.findIndex((tab) => tab.params === path.split('/')[1]);
  //   setSelectedTab(index);
  // }, [window.location.pathname]);

  React.useEffect(() => {
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
    <SidebarProvider>
    <Sidebar collapsible="icon" className="transition-all duration-300 ease-in-out">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo />
          <h6 className="text-xl font-semibold">LearnPDF</h6>
          <StatusText text={user?.status} type="info" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={tabs} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
    </SidebarProvider>
  );
}
