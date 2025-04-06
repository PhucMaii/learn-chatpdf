import React from 'react';
import { Button } from './ui/button';
import { EditIcon, Trash2Icon } from 'lucide-react';

export default function Project() {
  return (
    <div className="flex flex-col gap-2 justify-between p-4 border-1 border-gray-100 rounded-lg w-[400px] h-[200px]">
      <div className="flex flex-col gap-2">
        <div className="w-full flex items-center justify-between gap-2">
          <h6 className="text-lg text-gray-400">3 medias</h6>
          <div className="flex items-center">
            <Button variant="ghost">
              <Trash2Icon className="w-4 h-4 text-red-500" />
            </Button>
            <Button variant={'ghost'}>
              <EditIcon className="w-4 h-4 text-blue-500" />
            </Button>
          </div>
        </div>
        <h1 className="text-xl font-bold w-full">
          CSTP 2023 - Biological Sciences
        </h1>
      </div>

      <h6 className="text-lg text-gray-400">Last opened at: 2 days ago</h6>
    </div>
  );
}
