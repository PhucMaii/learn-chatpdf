import React, { useEffect } from 'react';
import MessageList from './MessageList';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import SelectComponent from './SelectComponent';
import { languages } from '@/lib/constant';

type Props = {
  messages: any[];
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  input: string;
  language: string;
  setLanguage: any;
};

const ChatComponent = ({
  messages,
  isLoading,
  handleSubmit,
  handleInputChange,
  input,
  language,
  setLanguage,
}: Props) => {
  // const [language, setLanguage] = useState<string>('English');

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
          <div className="flex-1">
            <SelectComponent
              label="Select a language"
              title="Language"
              items={languages}
              value={language}
              onChange={(value) => setLanguage(value)}
            />
          </div>

          <div className="flex-12 flex items-center">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask any question..."
              className="w-full border-gray-300"
            />
            <Button className="ml-2 hover:bg-emerald-500 hover:text-white hover:scale-102 transition-all duration-300" type="submit">
              <Send className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ChatComponent;
