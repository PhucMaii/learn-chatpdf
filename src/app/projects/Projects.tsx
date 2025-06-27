'use client';
import AddProject from '@/components/Dialogs/add/AddProject';
import LoadingComponent from '@/components/LoadingComponent';
import Project from '@/components/Project';
import SidebarWrapper from '@/components/SidebarWrapper';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useDebounce from '../../../hooks/useDebounce';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyDisplay from '@/components/EmptyDisplay';

export default function Projects() {
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [searchKeywords, setSearchKeywords] = useState<string>('');
  const [displayProjects, setDisplayProjects] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [guestSession, setGuestSession, isInitialized] = useLocalStorage(
    'guest-session',
    {},
  );
  const debouncedKeyword = useDebounce(searchKeywords, 500);

  useEffect(() => {
    if (isInitialized) {
      fetchProjects();
    }
  }, [isInitialized]);

  useEffect(() => {
    if (projects) {
      setDisplayProjects(projects);
    }
  }, [projects]);

  useEffect(() => {
    if (debouncedKeyword) {
      const newDisplayProjects = projects.filter((project) =>
        project.name.toLowerCase().includes(debouncedKeyword.toLowerCase()),
      );
      setDisplayProjects(newDisplayProjects);
    } else {
      setDisplayProjects(projects);
    }
  }, [debouncedKeyword]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `/api/project?guestSessionId=${guestSession.sessionId}`,
      );
      setProjects(response.data.projects);
      setDisplayProjects(response.data.projects);

      return response.data.projects;
    } catch (error: any) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleAddProject = () => {
    // Focus the AddProject dialog
    const addBtn = document.querySelector('[name="add-project"]') as HTMLElement;
    if (addBtn) addBtn.click();
  };

  return (
    <SidebarWrapper>
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-gray-500">Manage and organize your study projects easily.</p>
        </div>
        <AddProject refresh={fetchProjects} data-add-project />
      </header>
      <div className="mb-6 flex items-center gap-2 w-full">
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </span>
          <Input
            placeholder="Search projects..."
            value={searchKeywords}
            onChange={(e) => setSearchKeywords(e.target.value)}
            className="pl-10 rounded-md border-1 border-gray-300 h-12 text-base focus:border-emerald-500 focus:ring-emerald-500 w-full"
            name="search-projects"
            aria-label="Search projects"
          />
        </div>
      </div>
      {isInitializing ? (
        <div className="flex flex-col items-center justify-center w-full h-96">
          <LoadingComponent />
          <p className="mt-4 text-gray-500">Loading your projects...</p>
        </div>
      ) : displayProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 w-full">
          {displayProjects.map((project) => (
            <Project
              className="col-span-1 hover:shadow-xl border border-emerald-100 bg-white rounded-xl active:scale-95 transition-all duration-200"
              project={project}
              refresh={fetchProjects}
              key={project.id}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-96">
          <EmptyDisplay
            src="/images/no-projects.png"
            text="You haven't created any projects yet. Let's create the first one."
          />
          <Button onClick={handleAddProject} className="mt-6 h-12 px-6 text-lg rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-lg hover:from-emerald-500 hover:to-emerald-700 transition-all duration-300" data-add-project-empty>
            + Create Project
          </Button>
        </div>
      )}
    </SidebarWrapper>
  );
}
