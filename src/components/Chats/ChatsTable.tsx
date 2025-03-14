import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileTextIcon, Loader2, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DrizzleChat } from '@/lib/db/schema';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_URL, SubscriptionType } from '@/lib/type';
import toast from 'react-hot-toast';
import moment from 'moment';

type Props = {
  userChats: DrizzleChat[];
  setUserChats: any;
  subscription: SubscriptionType;
};

const ChatsTable = ({ userChats, setUserChats, subscription }: Props) => {
  const [deleting, setDeleting] = useState<any>({
    id: null,
    isDeleting: false,
  });
  const router = useRouter();

  const handleDeleteChat = async (e: any, chat: DrizzleChat) => {
    e.stopPropagation();

    setDeleting({ id: chat.id, isDeleting: true });
    try {
      const response = await axios.delete(`${API_URL.DELETE_CHAT}`, {
        data: {
          chatId: chat.id,
          fileKey: chat.fileKey,
        },
      });

      if (response.data.error) {
        toast.error('Something went wrong deleting chat');
        return;
      }

      const newChats = userChats.filter((c: DrizzleChat) => c.id !== chat.id);
      setUserChats({ baseData: newChats, displayData: newChats });
      toast.success('Chat deleted successfully');
      // router.refresh();
    } catch (error: any) {
      console.log(error);
      toast.error('Something went wrong deleting chat');
    } finally {
      setDeleting({ id: null, isDeleting: false });
    }
  };

  return (
    <Table className="mt-4">
      <TableCaption>A list of your chats with your PDFs.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Type</TableHead>
          <TableHead>File Name</TableHead>
          <TableHead>Created at</TableHead>
          <TableHead>Last opened</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userChats &&
          userChats.length > 0 &&
          userChats.map((chat: DrizzleChat) => (
            <TableRow
              key={chat?.id}
              onClick={() =>
                router.push(
                  `${subscription?.isPro || subscription?.isTrial ? `/chat/${chat.id}` : '/pricing'}`,
                )
              }
              className="hover:bg-gray-100 cursor-pointer"
            >
              <TableCell>
                <FileTextIcon />
              </TableCell>
              <TableCell className="font-bold text-md">
                {chat?.pdfName}
              </TableCell>
              <TableCell className="font-medium text-md">
                {moment(new Date(chat?.createdAt)).calendar()}
              </TableCell>
              <TableCell className="font-medium text-md">
                {moment(
                  new Date(chat?.lastOpenedAt || chat.createdAt),
                ).fromNow()}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleDeleteChat(e, chat)}
                  className="h-8 w-8 p-0 hover:bg-red-200 hover:text-red-500 active:scale-98 transition-all duration-300"
                >
                  {deleting.isDeleting && deleting.id === chat.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2Icon className="w-4 h-4 text-gray-500" />
                  )}
                </Button>
                {/* <div className="relative"> */}
                {/* <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-gray-200"
                      >
                      <>
                        <span className="sr-only">Open menu</span>
                        <MoreVerticalIcon className="h-4 w-4" />
                      </>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-white z-50"
                      // style={{ position: 'absolute', }}
                    >
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={(e) => handleDeleteChat(e, chat)}
                        className="text-red-600"
                        disabled={!subscription?.isPro}
                      >
                        {isDeleting ? 'Deleting...' : 'Remove chat'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(
                            `${subscription?.isPro || subscription?.isTrial ? `/chat/${chat.id}` : '/pricing'}`,
                          )
                        }
                      >
                        Go to chat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> */}
                {/* </div> */}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default ChatsTable;
