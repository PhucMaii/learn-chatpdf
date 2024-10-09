import { DrizzleChat } from '@/lib/db/schema';
import React from 'react';

type Props = {
    chats: DrizzleChat[];
    chatId: number
}

export default function ChatSidebat({chats, chatId}: Props) {
  return (
    <div>ChatSidebat</div>
  )
}
