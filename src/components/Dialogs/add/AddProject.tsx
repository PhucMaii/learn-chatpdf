import React, { useContext, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import toast from 'react-hot-toast';
import axios from 'axios';
import { IProject, SUBSCRIPTION_TYPE } from '@/lib/type';
import { UserContext } from '../../../../context/UserProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { trialProjects } from '@/lib/constant';
import { useRouter } from 'next/navigation';

interface IProps {
  setProjects: React.Dispatch<React.SetStateAction<IProject[]>>;
}

export default function AddProject({ setProjects }: IProps) {
  const { user, isInitializing, setUser }: any = useContext(UserContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>('');

  const router = useRouter();

  const handleSubmit = async () => {
    if (
      user?.status !== SUBSCRIPTION_TYPE.PRO &&
      user?.projects &&
      user?.projects?.length >= trialProjects
    ) {
      router.push('/pricing');
      return;
    }

    if (!projectName) {
      toast.error('Please enter a project name.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/project', {
        name: projectName,
      });

      if (response.status === 200) {
        toast.success('Project created successfully!');
        setProjects((prevProjects: IProject[]) => [
          ...prevProjects,
          response.data.project,
        ]);

        setUser((prevUser: any) => {
          if (!prevUser) return prevUser;
          const newProjects = [...prevUser.projects, response.data.project];
          return { ...prevUser, projects: newProjects };
        });
        setProjectName(''); // Clear input field after successful creation
        setOpen(false);
      } else {
        toast.error('Failed to create project. Please try again.');
      }
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast.error(error?.response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return <Skeleton />;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            if (
              user?.status !== SUBSCRIPTION_TYPE.PRO &&
              user?.projects &&
              user?.projects?.length >= trialProjects
            ) {
              router.push('/pricing');
            } else {
              setOpen(true);
            }
          }}
        >
          + New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="project-name"
            className="text-sm font-regular text-gray-700"
          >
            Project Name
          </label>
          <Input
            id="project-name"
            type="text"
            placeholder="Enter project name"
            className="rounded-md p-2"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button disabled={isLoading} onClick={handleSubmit} type="submit">
            {isLoading ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
