'use client';

import { type LucideIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { tabs } from '@/lib/constant';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function NavMain({}: {
  items: {
    title: string;
    icons?: LucideIcon;
    url: string;
  }[];
}) {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  useEffect(() => {
    const path = window.location.pathname;
    const index = tabs.findIndex((tab) => tab.params === path.split('/')[1]);
    setSelectedTab(index);
  }, [window.location.pathname]);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {tabs.map((tab, index) => (
          <SidebarMenuItem
            key={tab.title}
            className={cn('font-semibold text-gray-400 p-1', {
              'text-primary': index === selectedTab,
            })}
          >
            <SidebarMenuButton
              asChild
              className="p-5 active:scale-90 transition-all duration-300"
            >
              <a href={tab.url}>
                <tab.icon style={{ width: '1.5rem', height: '1.5rem' }} />
                <span className="text-xl">{tab.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          // <Collapsible
          //   key={item.title}
          //   asChild
          //   defaultOpen={item.isActive}
          //   className="group/collapsible"
          // >
          //   <SidebarMenuItem>
          //     <CollapsibleTrigger asChild>
          //       <SidebarMenuButton tooltip={item.title}>
          //         {item.icon && <item.icon />}
          //         <span>{item.title}</span>
          //         <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          //       </SidebarMenuButton>
          //     </CollapsibleTrigger>
          //     <CollapsibleContent>
          //       <SidebarMenuSub>
          //         {item.items?.map((subItem) => (
          //           <SidebarMenuSubItem key={subItem.title}>
          //             <SidebarMenuSubButton asChild>
          //               <a href={subItem.url}>
          //                 <span>{subItem.title}</span>
          //               </a>
          //             </SidebarMenuSubButton>
          //           </SidebarMenuSubItem>
          //         ))}
          //       </SidebarMenuSub>
          //     </CollapsibleContent>
          //   </SidebarMenuItem>
          // </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
