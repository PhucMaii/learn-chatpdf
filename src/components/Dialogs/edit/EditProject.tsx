import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import toast from 'react-hot-toast';
import axios from 'axios';
import { IProject } from '@/lib/type';

interface IProps {
  open: boolean;
  onClose: any;
  project: IProject;
  setProjects: React.Dispatch<React.SetStateAction<IProject[]>>;
}

export default function EditProject({ open, onClose, project, setProjects }: IProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>(project.name);

  useEffect(() => {
    setProjectName(project.name);
  }, [project]);

  const handleSubmit = async () => {
    if (!projectName) {
      toast.error('Please enter a project name.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(`/api/project`, {
        projectId: project.id,
        name: projectName,
      });

      if (response.status === 200) {
        toast.success('Project updated successfully!');
        setProjects((prevProjects: IProject[]) =>
          prevProjects.map((p) =>
            p.id === project.id ? { ...p, name: projectName } : p,
          ),
        );
        onClose();
      } else {
        toast.error('Failed to update project. Please try again.');
      }
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
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
            {isLoading ? 'Updating...' : 'Update Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
