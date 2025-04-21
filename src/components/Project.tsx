import React, { useState } from 'react';
import { Button } from './ui/button';
import { Trash2Icon } from 'lucide-react';
import { IProject } from '@/lib/type';
import { convertToFromNow } from '@/utils/date';
import toast from 'react-hot-toast';
import axios from 'axios';
import EditProject from './Dialogs/edit/EditProject';
import DeleteDialog from './Dialogs/delete/DeleteDialog';
import { useRouter } from 'next/navigation';

interface IProps {
  className?: string;
  project: IProject;
  setProjects: React.Dispatch<React.SetStateAction<IProject[]>>;
}

export default function Project({ className, project, setProjects }: IProps) {
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const router = useRouter();

  const handleDeleteProject = async () => {
    try {
      const response = await axios.delete(`/api/project?id=${project.id}`);

      console.log('Delete project response:', response);
      if (response.status === 200) {
        toast.success('Project deleted successfully');

        // Assuming you have a way to update the projects state
        setProjects((prevProjects) => {
          const newProjects = prevProjects.filter((p) => p.id !== project.id);
          console.log('Updated projects:', { newProjects });
          return newProjects;
        });
      }
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project. Please try again later.');
    } finally {
    }
  };

  return (
    <div
      className={`flex flex-col gap-2 cursor-pointer justify-between p-4 border-1 border-gray-100 rounded-lg max-w-[400px] h-[200px] ${className}`}
      onClick={() => router.push(`/projects/${project.id}`)}
    >
      {/* If project is not created by guest, show delete dialog */}
      {project?.userId && (
        <DeleteDialog
          isOpen={isOpenDelete}
          onClose={() => setIsOpenDelete(false)}
          onDelete={handleDeleteProject}
          message={`Are you sure you want to delete the project "${project.name}"? This action cannot be undone.`}
        />
      )}
      <div className="flex flex-col gap-2">
        <div className="w-full flex items-center justify-between gap-2">
          {/* Will replace with project.medias.length */}
          <h6 className="text-sm text-gray-400">
            {project?.medias?.length} medias
          </h6>
          <div className="flex items-center">
            <Button
              onClick={(e: any) => {
                e.stopPropagation();
                setIsOpenDelete(true);
              }}
              variant="ghost"
              className="hover:bg-red-100"
              disabled={!project?.userId}
            >
              <Trash2Icon className="w-4 h-4 text-red-500" />
            </Button>
            {project?.userId && <EditProject project={project} setProjects={setProjects} />}
          </div>
        </div>
        <h1 className="text-xl font-bold w-full">{project?.name}</h1>
      </div>

      <h6 className="text-sm text-gray-400">
        Created at: {convertToFromNow(project.lastOpenedAt)}
      </h6>
    </div>
  );
}
