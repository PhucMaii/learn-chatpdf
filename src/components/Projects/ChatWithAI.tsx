import { useRef, useEffect, useState } from 'react';
import { ArrowUpIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MessageList from '../MessageList';
import SelectComponent from '../SelectComponent';
import { languages } from '@/lib/constant';
import { useParams } from 'next/navigation';
import useLocalStorage from '../../../hooks/useLocalStorage';
import toast from 'react-hot-toast';
import axios from 'axios';
import SectionContainer from '../SectionContainer';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function ChatWithAI() {
  const { id: projectId } = useParams();
  const [initialMsg, setInitialMsg] = useState<Message[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [guestSession, _setGuestSession, isInitialized] = useLocalStorage(
    'guest-session',
    {},
  );

  const [language, setLanguage] = useState<string>('English');

  useEffect(() => {
    // Ensure guestSession is ready before fetching messages
    if (isInitialized) {
      fetchMsg();
    }
  }, [isInitialized]);

  useEffect(() => {
    // Set messages when initial messages are loaded
    if (initialMsg && initialMsg.length > 0) {
      setMessages(initialMsg);
    }
  }, [initialMsg]);

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
  }, [input]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    
    // Create assistant message placeholder for streaming
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Make the streaming request
      const response = await fetch(`/api/chat?guestSessionId=${guestSession?.sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          projectId,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No reader available');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Process complete SSE messages
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6); // Remove 'data: ' prefix
            
            if (data === '[DONE]') {
              setIsLoading(false);
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              
              switch (parsed.type) {
                case 'content':
                  // Update the assistant message with new content
                  setMessages(prev => 
                    prev.map(msg => 
                      msg.id === assistantMessageId 
                        ? { ...msg, content: msg.content + parsed.content }
                        : msg
                    )
                  );
                  break;
                  
                case 'done':
                  setIsLoading(false);
                  // Optionally update with final complete response
                  setMessages(prev => 
                    prev.map(msg => 
                      msg.id === assistantMessageId 
                        ? { ...msg, content: parsed.fullResponse }
                        : msg
                    )
                  );
                  break;
                  
                case 'error':
                  setIsLoading(false);
                  toast.error(parsed.error || 'An error occurred');
                  // Remove the placeholder assistant message on error
                  setMessages(prev => 
                    prev.filter(msg => msg.id !== assistantMessageId)
                  );
                  break;
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError);
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      setIsLoading(false);
      toast.error('Failed to send message');
      
      // Remove the placeholder assistant message on error
      setMessages(prev => 
        prev.filter(msg => msg.id !== assistantMessageId)
      );
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
            disabled={isLoading}
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
            <Button 
              name="send-message" 
              variant="ghost" 
              onClick={handleSubmit}
              disabled={isLoading || !input.trim()}
            >
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
