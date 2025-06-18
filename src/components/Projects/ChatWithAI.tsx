import { useRef, useEffect, useState } from 'react';
import { ArrowUpIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MessageList from '../MessageList';
import SelectComponent from '../SelectComponent';
import { languages } from '@/lib/constant';
import { useChat } from 'ai/react';
import { useParams } from 'next/navigation';
import useLocalStorage from '../../../hooks/useLocalStorage';
import toast from 'react-hot-toast';
import axios from 'axios';
import SectionContainer from '../SectionContainer';

export default function ChatWithAI() {
  const { id: projectId } = useParams();
  const [initialMsg, setInitialMsg] = useState<any>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [guestSession, setGuestSession, isInitialized] = useLocalStorage(
    'guest-session',
    {},
  );

  const [language, setLanguage] = useState<string>('English');

  const { input, handleSubmit, handleInputChange, messages, isLoading } =
    useChat({
      api: `/api/chat?guestSessionId=${guestSession?.sessionId}`,
      body: {
        projectId,
        language,
        isAnswerOutOfContext: false,
      },
      initialMessages: initialMsg || [],
    });

  useEffect(() => {
    // Ensure guestSession is ready before fetching messages
    if (isInitialized) {
      fetchMsg();
    }
  }, [isInitialized]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to measure new scrollHeight
      textarea.style.height = 'auto';

      // Calculate the max height for 5 rows
      const lineHeight = 24; // Adjust this if your line-height is different
      const maxHeight = lineHeight * 10;

      // Set height but don't exceed 5 rows
      textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
    }
  }, [messages]);

  const fetchMsg = async () => {
    try {
      const response = await axios.get(
        `/api/messages?projectId=${projectId}&guestSessionId=${guestSession?.sessionId}`,
      );

      if (response.data.error) {
        toast.error('Something went wrong in fetching messages');
        return;
      }

      setInitialMsg(response.data.messages);
    } catch (error: any) {
      console.log('There was an error in fetching messages: ', error);
      toast.error('Something went wrong in fetching messages');
    }
  };

  return (
    <SectionContainer>
      {messages.length > 0 ? (
        <div className="w-full md:w-xl lg:w-2xl xl:w-4xl mb-24 flex items-center justify-center">
          <MessageList messages={messages} isLoading={isLoading} />
        </div>
      ) : (
        <div className="w-full md:w-xl lg:w-2xl xl:w-4xl flex items-center justify-center">
          <h1 className="text-4xl font-bold">How can I help you today?</h1>
        </div>
      )}

      {/* <div className="h-16 flex flex-col mx-auto md:w-xl lg:w-2xl xl:w-4xl"> */}
      <div className="sticky bottom-0 mx-auto w-full md:w-xl lg:w-2xl xl:w-4xl bg-gray-50 rounded-xl z-50 px-4 py-4">
        {/* Chat input area */}
        {/* <div className="p-4 bg-white border-t border-gray-200 z-50 w-full flex justify-center"> */}
        <div className="w-full md:w-xl lg:w-2xl xl:w-4xl">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            className="w-full px-6 py-3 text-gray-900 rounded-xl focus:outline-none resize-none "
            placeholder="Ask me anything..."
            spellCheck="false"
            rows={3}
          />

          <div className="flex w-[95%] justify-between items-center gap-2 mt-2">
            <div>
              <SelectComponent
                label="Select a language"
                title="Language"
                items={languages}
                value={language}
                onChange={(value) => setLanguage(value)}
              />
            </div>
            <Button name="send-message" variant="ghost" onClick={handleSubmit}>
              <ArrowUpIcon />
            </Button>
          </div>
          {/* </div> */}
        </div>
      </div>
      {/* </div> */}
    </SectionContainer>
  );
}
