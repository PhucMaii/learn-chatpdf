'use client';

import * as React from 'react';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { tabs } from '@/lib/constant';
import Logo from './Landing/Logo';
import StatusText from './StatusText';

export function AppSidebar({ user, selectedTab }: any) {
  return (
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
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}
