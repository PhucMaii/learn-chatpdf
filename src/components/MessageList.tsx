import { cn } from '@/lib/utils';
// import { Message } from 'ai/react';
import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

type Props = {
  messages: any[];
  isLoading: boolean;
};

const AssistantChat = (text: string) => {
  return <ReactMarkdown>{text}</ReactMarkdown>;
};

function MessageList({ messages, isLoading }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  if (!messages) {
    return <></>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    bottomRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col gap-8 px-4 pb-4 w-full">
      {messages.map((message, index) => {
        return (
          <div
            key={index}
            className={cn('flex', {
              'justify-end': message.role === 'user',
              'justify-start': message.role === 'assistant',
            })}
          >
            {/* <div
              className={cn(
                'rounded-lg px-3 py-2  py01 shadow-md ring-1 ring-gray-900/10',
                {
                  'bg-blue-600 text-white': message.role === 'user',
                  'bg-white text-black': message.role === 'assistant',
                },
              )}
            >
              <p className="text-md font-regular font-sans">
                {message.content}
              </p>
            </div> */}
            {message.role === 'user' ? (
              <div className="flex bg-gray-200 rounded-lg px-3 py-2 items-center">
                <p className="text-md font-regular font-sans">
                  {message.content}
                </p>
              </div>
            ) : (
              <div className="flex items-center">
                <p className="text-md font-regular font-sans leading-[1.8]">
                  {AssistantChat(message.content)}
                </p>
              </div>
            )}
          </div>
        );
      })}
      {isLoading && (
        <div className="flex items-center">
          <h6 className="text-md font-regular font-sans transition-all duration-300 animate-pulse">Typing...</h6>
        </div>
      )}

      <div ref={bottomRef}></div>
    </div>
  );
}

export default MessageList;
