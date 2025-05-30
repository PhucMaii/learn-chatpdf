import { extractYouTubeID } from '@/lib/youtube-transcript';
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import toast from 'react-hot-toast';
import axios from 'axios';

interface IProps {
  projectId: number;
  defaultLink?: string;
  className?: string;
  setDisplay?: (display: any) => void;
}

const YoutubeLinkUpload = ({ defaultLink, className, projectId, setDisplay }: IProps) => {
  const [value, setValue] = useState(defaultLink);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (defaultLink) {
      setValue(defaultLink);
    }
  }, [defaultLink]);

  const handleUpload = async () => {
    if (!value) {
      toast.error('Please enter a valid Youtube link');
      return;
    }
    const processedVideoId = extractYouTubeID(value);

    if (!processedVideoId) {
      toast.error('Please enter a valid Youtube link');
      return;
    }

    try {
      setIsLoading(true);
      setDisplay?.((prevFiles: any) => {
        return [
          ...prevFiles,
          {
            fileName: value,
            loading: true,
          },
        ];
      });
      const eventSource = new EventSource(
        `/api/media/stream?projectId=${projectId}&url=${value}`,
      );

      eventSource.onmessage = (event) => {
        const { stage, projectMedias } = JSON.parse(event.data);
        // if (guestSession) {
        //   setGuestSession({
        //     sessionId: guestSession.guestSessionId,
        //     signature: guestSession.guestSessionSignature,
        //   });
        // }

        if (stage === 'done') {
          // router.push(`/chat/${chatId}`);
          toast.success('Upload Successfully', { id: 'upload-progress' });
          setIsLoading(false);

          eventSource.close();

          // setOptimisticDisplays((prev: any[]) => {
          //   // Keep optimistic items (e.g. still loading: true)
          //   const optimisticOnly = prev.filter((item) => item.loading);
          //   // Replace the rest with new server data
          //   return [...projectMedias, ...optimisticOnly];
          // });
        } else {
          toast.loading(stage, { id: 'upload-progress' });
        }
      };

      eventSource.onerror = (err) => {
        console.error('SSE error:', err);
        console.log(err, 'ERROR');
        eventSource.close();
      };
    } catch (error: any) {
      console.error('Error uploading video', error);
      toast.error('Something went wrong');
    }
  };

  return (
    <div
      className={`flex md:flex-row flex-col items-center gap-2 p-2 rounded-xl h-2xl ${className}`}
    >
      <input
        type="text"
        placeholder="https://www.youtube.com/watch?v=..."
        className={`w-full px-4 py-2 border border-gray-300 rounded-md ${className}`}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        // onBlur={handleBlur}
        // onKeyDown={handleKeyDown}
      />
      <Button
        className="w-full md:w-auto"
        onClick={handleUpload}
        disabled={isLoading}
      >
        {isLoading ? 'Uploading...' : 'Upload'}
      </Button>
    </div>
  );
};

export default YoutubeLinkUpload;
