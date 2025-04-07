'use client';
import AddProject from '@/components/Dialogs/add/AddProject';
import LoadingComponent from '@/components/LoadingComponent';
import Project from '@/components/Project';
import SidebarWrapper from '@/components/SidebarWrapper';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function ProjectsPage() {
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [searchKeywords, setSearchKeywords] = useState<string>('');
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/project');
      setProjects(response.data.projects);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsInitializing(false);
    }
  };

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
          <AddProject setProjects={setProjects} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 auto-rows-auto gap-2 items-center flex-wrap w-full">
          {isInitializing ? (
            <div className="col-span-5 flex flex-col items-center justify-center w-full h-full">
              <LoadingComponent />
            </div>
          ) : projects.length > 0 ? (
            projects.map((project) => (
              <Project
                className="col-span-1"
                project={project}
                setProjects={setProjects}
                key={project.id}
              />
            ))
          ) : (
            <div className="col-span-5 flex flex-col items-center justify-center w-full h-full">
              <img
                src="/images/no-projects.png"
                alt="No projects"
                className="w-[200px] h-[200px] object-contain mx-auto my-4"
                width={200}
                height={200}
                loading="lazy"
              />

              <h4>
                You haven&apos;t created any projects yet. Let&apos;s create the
                first one.
              </h4>
              <AddProject 
                setProjects={setProjects}
              />
            </div>
          )}
        </div>
      </div>
    </SidebarWrapper>
  );
}
