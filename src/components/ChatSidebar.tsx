'use client';
import { DrizzleChat } from '@/lib/db/schema';
import Link from 'next/link';
import React, { useContext } from 'react';
import { Button } from './ui/button';
import { ArrowLeftIcon, MessageCircleMoreIcon, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import SubscriptionButton from './SubscriptionButton';
import { MAX_FILE_UPLOAD_IN_TRIAL } from '@/lib/constant';
import { useRouter } from 'next/navigation';
import { SubscriptionType } from '@/lib/type';
import { UserContext } from '../../context/UserProvider';

type Props = {
  chats: any; // {date: [{chatId: number, flashcard, etc}]}
  chatId: number;
  subscription: SubscriptionType;
};

export default function ChatSidebar({ chats, chatId, subscription }: Props) {
  const { user }: any = useContext(UserContext);

  const router = useRouter();

  return (
    <div className="w-full h-screen p-4 text-gray-200 bg-white">
      <div className="flex lg:items-center items-start flex-col lg:flex-row gap-2 mb-4">
        {/* Handle if guest got to chats and they can only go back to landing page */}
        <Link
          href={user ? '/chats' : '/'}
          className="hover:scale-105 active:scale-90 transition-all duration-300"
        >
          <ArrowLeftIcon className="w-8 h-8 text-black" />
        </Link>
        <h6 className="text-lg font-semibold text-black">Chats</h6>

        <SubscriptionButton isPro={subscription?.isPro} />
      </div>
      <Button
        disabled={
          !subscription?.isPro ||
          !subscription?.isAbleToAddMoreChats ||
          chats?.length === MAX_FILE_UPLOAD_IN_TRIAL ||
          !user
        }
        className="w-full border-dashed border-2 border-gray-800 text-black bg-white hover:bg-emerald-500 hover:text-white active:scale-90 transition-all duration-300"
        onClick={() => router.push('/create-chat')}
      >
        <PlusCircle className="mr-2 w-4 h-4" />
        New Chat
      </Button>

      <div className="flex flex-col gap-2 mt-4">
        {chats &&
          Object.keys(chats).map((date: string) => {
            return (
              <>
                <h4 className="font-semibold text-md text-gray-500">{date}</h4>
                {chats[date].map((chat: DrizzleChat) => (
                  <Link href={`/chat/${chat.id}`} key={chat.id}>
                    <div
                      className={cn(
                        'rounded-lg p-3 text-slate-400 flex items-center gap-2 font-semibold active:scale-90 transition-all duration-300',
                        {
                          'text-emerald-500': chat.id === chatId,
                          'hover:text-emerald-500': chat.id !== chatId,
                        },
                      )}
                    >
                      <MessageCircleMoreIcon className="w-6 h-6" />
                      <p className="w-full overflow-hidden text-md truncate whitespace-nowrap text-ellipsis">
                        {chat?.pdfName || chat?.webUrl}
                      </p>
                    </div>
                  </Link>
                ))}
              </>
            );
          })}
      </div>
    </div>
  );
}
