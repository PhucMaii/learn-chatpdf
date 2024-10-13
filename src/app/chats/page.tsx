import ChatCard from '@/components/Chats/ChatCard'
import Sidebar from '@/components/Sidebar'
import SidebarWrapper from '@/components/SidebarWrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { db } from '@/lib/db'
import { chats } from '@/lib/db/schema'
import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { FileTextIcon, MoreHorizontalIcon, MoreVerticalIcon } from 'lucide-react'
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'


const Chats = async () => {
  const { userId } = await auth();

  if (!userId) {
    toast.error('Unauthorized');
    return;
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  console.log(_chats, 'chats');

  return (
    <SidebarWrapper>
       {/* Header */}
      <h1 className="text-3xl font-bold ">Chats</h1>
      <h6 className="text-md font-bold text-gray-400">
        Make conversations with your PDFs
      </h6>

      {/* Search bar */}
      <div className="flex gap-2 w-full mt-6">
       <Input 
        placeholder='Search chats...'
       />
       <Link href="/create-chat">
        <Button className="bg-black ">+ New Chat</Button>
       </Link>
      </div>

      {/* Chats */}
      <h4 className="text-lg mt-6 font-bold">Recent chats</h4>
      <Table className="mt-4">
        <TableCaption>A list of your recent chats.</TableCaption>
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
          {
            _chats.map(chat => (
              <TableRow key={chat.id}>
                <TableCell><FileTextIcon /></TableCell>
                <TableCell className="font-bold text-md">{chat.pdfName}</TableCell>
                <TableCell className="font-bold text-md text-gray-600">{chat.createdAt.toDateString()}</TableCell>
                <TableCell className="font-bold text-md text-gray-600">{chat.createdAt.toDateString()}</TableCell>
                <TableCell>
                  <Button className="bg-transparent text-black hover:bg-gray-200 px-1">
                    <MoreVerticalIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>

    </SidebarWrapper>
  )
}

export default Chats