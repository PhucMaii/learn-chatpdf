import React, { useEffect } from 'react';
import MessageList from './MessageList';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Send } from 'lucide-react';

type Props = {
  messages: any[];
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  input: string;
};

const ChatComponent = ({
  messages,
  isLoading,
  handleSubmit,
  handleInputChange,
  input,
}: Props) => {
  useEffect(() => {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);
  return (
    <>
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      <MessageList messages={messages} isLoading={isLoading} />

      {/* message list */}
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white  "
      >
        <div className="flex items-center gap-1">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full"
          />
          <Button className="ml-2">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </>
  );
};

export default ChatComponent;
