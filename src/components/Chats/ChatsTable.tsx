import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { FileTextIcon, MoreVerticalIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DrizzleChat } from '@/lib/db/schema';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_URL } from '@/lib/type';
import toast from 'react-hot-toast';
import moment from 'moment';

type Props = {
    userChats: DrizzleChat[];
    setUserChats: any;
}

const ChatsTable = ({userChats, setUserChats}: Props) => {
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const router = useRouter();

    const handleDeleteChat = async (e: any, chat: DrizzleChat) => {
        e.stopPropagation();

        setIsDeleting(true);
        try {
            const response = await axios.delete(`${API_URL.DELETE_CHAT}`, {
                data: {
                    chatId: chat.id,
                    fileKey: chat.fileKey
                }
            });

            if (response.data.error) {
                toast.error('Error deleting chat: ' + response.data.error);
                return;
            }

            const newChats = userChats.filter((c: DrizzleChat) => c.id !== chat.id);
            setUserChats({baseData: newChats, displayData: newChats});
            toast.success('Chat deleted successfully');
            // router.refresh();

            setIsDeleting(false);
        } catch (error) {
            toast.error('Error deleting chat: ' + error);
            setIsDeleting(false);
        }
    }

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
            {userChats && userChats.length > 0 && userChats.map((chat: DrizzleChat) => (
              <TableRow key={chat?.id} onClick={() => router.push(`/chat/${chat.id}`)}>
                <TableCell><FileTextIcon /></TableCell>
                <TableCell className="font-bold text-md">{chat?.pdfName}</TableCell>
                <TableCell className="font-bold text-md text-gray-600">{moment(new Date(chat?.createdAt)).calendar()}</TableCell>
                <TableCell className="font-bold text-md text-gray-600">{moment(new Date(chat?.lastOpenedAt || chat.createdAt)).fromNow()}</TableCell>
                <TableCell>
                  {/* <Button className="bg-transparent text-black hover:bg-gray-200 px-1">
                    <MoreVerticalIcon />
                  </Button> */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={(e) => handleDeleteChat(e, chat)}
                      className="text-red-600"
                    >
                        {
                          isDeleting ? 'Deleting...' : 'Remove chat'
                        }
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push(`/chat/${chat.id}`)}>Go to chat</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
      </Table>
  )
}

export default ChatsTable