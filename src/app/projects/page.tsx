'use client';
import Project from '@/components/Project';
import SidebarWrapper from '@/components/SidebarWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';

export default function ProjectsPage() {
    const [searchKeywords, setSearchKeywords] = useState<string>('');

  return (
    <SidebarWrapper>
      <h1 className="text-2xl font-semibold">Projects</h1>

      <div className="flex flex-col gap-4 mt-6 p-4 border-1 border-gray-100 rounded-lg">
        <div className="flex gap-2 mt-6 rounded-lg">
          <Input
            placeholder="Search chats..."
            value={searchKeywords}
            onChange={(e) => setSearchKeywords(e.target.value)}
            className="rounded-md border-1 border-gray-300"
          />
          {/* {subscription?.isPro || subscription?.isAbleToAddMoreChats ? (
            <Link href="/create-chat">
              <Button className="bg-black text-white font-semibold transition-all duration-300 active:scale-90">
                + New Chat
              </Button>
            </Link>
          ) : (
            <Button
              disabled
              className="bg-[#1E1E1E] text-white cursor-not-allowed"
            >
              + New Chat
            </Button>
          )} */}
          <Button>
            + New Project
          </Button>
        </div>

        <div className="flex gap-2 items-center flex-wrap">
            <Project />
            <Project />
            <Project />
            <Project />
            <Project />
        </div>
      </div>
    </SidebarWrapper>
  );
}
