import React, { useContext, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { FileTextIcon, Link, Loader2, Trash2Icon } from 'lucide-react';
import moment from 'moment';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import axios from 'axios';
import { UserContext } from '../../../context/UserProvider';

interface IProps {
  medias: any[];
  setMedias: any;
}

export default function MediasTable({ medias, setMedias }: IProps) {
  const { user } = useContext(UserContext) ?? { user: null };

  const [deleting, setDeleting] = useState<any>({
    id: null,
    isDeleting: false,
  });

  const handleDelete = async (id: number) => {
    try {
      setDeleting({ id, isDeleting: true });

      const response = await axios.delete(`/api/media?id=${id}`);

      if (response.data.error) {
        toast.error('Something went wrong in deleting media');
        return;
      }

      toast.success('Media deleted successfully');
      setMedias(medias.filter((media: any) => media.id !== id));
    } catch (error: any) {
      console.log('Internal Server Error: ', error);
      toast.error('Something went wrong in deleting media');
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table className="mt-4">
        <TableCaption>A list of your medias.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medias &&
            medias.length > 0 &&
            medias.map((media: any, index: number) => (
              <TableRow
                key={index}
                className={`hover:bg-gray-100 cursor-pointer ${media?.loading && 'animate-pulse bg-gray-100'}`}
              >
                <TableCell>
                  {media?.loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : media?.url ? (
                    <Link />
                  ) : (
                    <FileTextIcon />
                  )}
                </TableCell>
                <TableCell
                  className={`max-w-[200px] truncate font-semibold text-md ${media.loading && 'animate-pulse bg-gray-100'}`}
                >
                  {media?.url || media?.fileName}
                </TableCell>
                <TableCell className="font-medium text-md">
                  {moment(new Date(media?.createdAt || new Date())).calendar()}
                </TableCell>
                <TableCell>
                  {user && <Button
                    variant="ghost"
                    size="icon"
                    name="delete-media"
                    // onClick={(e) => handleDeletemedia(e, media)}
                    className="h-8 w-8 p-0 hover:bg-red-200 hover:text-red-500 active:scale-98 transition-all duration-300"
                    disabled={
                      (deleting.isDeleting && deleting.id === media.id) ||
                      media.loading
                    }
                    onClick={() => handleDelete(media.id)}
                  >
                    {deleting.isDeleting && deleting.id === media.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2Icon className="w-4 h-4 text-gray-500" />
                    )}
                  </Button>}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
