import React, { useContext, useState } from 'react';
import { Button } from './ui/button';
import { Trash2Icon } from 'lucide-react';
import { IProject } from '@/lib/type';
import { convertToFromNow } from '@/utils/date';
import toast from 'react-hot-toast';
import axios from 'axios';
import EditProject from './Dialogs/edit/EditProject';
import DeleteDialog from './Dialogs/delete/DeleteDialog';
import { EditIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../../context/UserProvider';

interface IProps {
  className?: string;
  project: IProject;
  refresh: () => Promise<any>;
}

export default function Project({ className, project, refresh }: IProps) {
  const { setUser } = useContext(UserContext) as any;
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const  [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const router = useRouter();

  const handleDeleteProject = async () => {
    try {
      const response = await axios.delete(`/api/project?id=${project.id}`);

      console.log('Delete project response:', response);
      if (response.status === 200) {
        toast.success('Project deleted successfully');

        // Assuming you have a way to update the projects state
        const projects = await refresh();

        setUser((prevUser: any) => {
          if (!prevUser) return prevUser;
          const newProjects = projects;
          return {
            ...prevUser,
            projects: newProjects,
          };
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

      {project?.userId && (
        <EditProject open={isOpenEdit} onClose={() => setIsOpenEdit(false)} project={project} refresh={refresh} />
      )}
      <div
        className="flex flex-col gap-2"
        onClick={() => router.push(`/projects/${project.id}`)}
      >
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
            <Button 
            variant="ghost"
            className="hover:bg-blue-100"
            disabled={!project?.userId}
            onClick={(e: any) => {
              e.stopPropagation();
              setIsOpenEdit(true)
            }}
            >
              <EditIcon className="w-4 h-4 text-blue-500" />
            </Button>
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
