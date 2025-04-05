'use client';

import { uploadToS3 } from '@/lib/s3';
// import { useMutation } from '@tanstack/react-query';
import { Inbox, Loader2 } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Button } from './ui/button';
import useLocalStorage from '../../hooks/useLocalStorage';
import { UserContext } from '../../context/UserProvider';
import axios from 'axios';

interface IProps {
  noIncludeLink?: boolean;
  className?: string;
  msg?: string;
  loadingTextClassName?: string;
}

const FileUpload = ({ className, noIncludeLink, msg, loadingTextClassName }: IProps) => {
  const router = useRouter();
  const { user }: any = useContext(UserContext);

  const [isGuestUploaded, setIsGuestUploaded] = useState<boolean>(false);
  const [guestSession] = useLocalStorage('guest-session', {});

  const [isLearning, setIsLearning] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isUploadingLink, setIsUploadingLink] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [url, setUrl] = useState<string>('');

  // const { mutate } = useMutation({
  //   mutationFn: async ({
  //     fileKey,
  //     fileName,
  //   }: {
  //     fileKey: string;
  //     fileName: string;
  //   }) => {
  //     const response = await axios.post('/api/create-chat', {
  //       fileKey,
  //       fileName,
  //     });
  //     return response.data;
  //   },
  // });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'applications/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        ['.pptx'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 30 * 1024 * 1024) {
        // Bigger than 30MB
        toast.error('Please upload a smaller file');
        return;
      }

      try {
        setIsUploading(true);
        const data = await uploadToS3(file, setProgress);
        setIsUploading(false);

        // setIsLearning(true);
        setTimeout(() => setIsLearning(true), 1);
        if (!data?.fileKey || !data?.fileName) {
          toast.error(
            'Oops! Looks like the file is not uploaded correctly. Please try again later.',
          );
          return;
        }

        const currentSession = JSON.parse(localStorage.getItem('guest-session') || '{}');

        const eventSource = new EventSource(
          `/api/create-chat-stream?fileKey=${data.fileKey}&fileName=${data.fileName}&guestSessionId=${currentSession.sessionId}&guestSessionSignature=${currentSession.signature}`,
        );

        eventSource.onmessage = (event) => {
          const { stage, chatId } = JSON.parse(event.data);
          // if (guestSession) {
          //   setGuestSession({
          //     sessionId: guestSession.guestSessionId,
          //     signature: guestSession.guestSessionSignature,
          //   });
          // }
          console.log('[SSE]', stage);

          if (stage === 'done' && chatId) {
            router.push(`/chat/${chatId}`);
            toast.success('Chat created!', { id: 'upload-progress' });
          } else {
            toast.loading(stage, { id: 'upload-progress' });
          }
        };

        eventSource.onerror = (err) => {
          console.error('SSE error:', err);
          eventSource.close();
        };

        // mutate(data, {
        //   onSuccess: ({ chatId }) => {
        //     toast.success('Chat Created');
        //     router.push(`/chat/${chatId}`);
        //   },
        //   onError: (error: any) => {
        //     toast.error(
        //       'Oops! We encountered an error, but your chat has been created.',
        //     );
        //     router.push(`/chat/${error.chatId}`);
        //     console.log(error);
        //   },
        //   // onSettled: () => {
        //   //   // Listen to the events sending from backend
        //   //   const eventSource = new EventSource('/api/stream');
        //   //   eventSource.onmessage = (event) => {
        //   //     console.log(event.data);
        //   //   };
        //   //   eventSource.onopen = () => {
        //   //     console.log('Connected to the stream');
        //   //   };
        //   //   eventSource.onerror = () => {
        //   //     console.log('Error connecting to the stream');
        //   //   };
        //   // },
        // });
        setIsUploading(false);
        setIsLearning(false);
      } catch (error) {
        console.log(error);
        setIsUploading(false);
        setIsLearning(false);
      }
    },
  });

  useEffect(() => {
    if (guestSession.sessionId && !user) {
      const fetchGuest = async () => {
        try {
          const response = await axios.get(
            `/api/guest?guestSessionId=${guestSession.sessionId}`,
          );
          if (response.data.error) {
            // toast.error('Something went wrong in fetching user chats');
            return;
          }

          if (response.data.guestChats.length > 0) {
            setIsGuestUploaded(true);
          }
        } catch (error: any) {
          console.log(error);
          // toast.error('Something went wrong in fetching user chats');
        }
      };

      fetchGuest();
    }
  }, [guestSession]);

  const uploadLink = async () => {
    if (!url || !url.startsWith('https://')) {
      toast.error('Please enter a valid URL');
      return;
    }

    setTimeout(() => setIsUploadingLink(true), 1);
    setIsUploading(true);
    try {
      const eventSource = new EventSource(`/api/create-chat-stream?url=${url}`);

      eventSource.onmessage = (event) => {
        const { stage, chatId } = JSON.parse(event.data);
        console.log('[SSE]', stage);

        if (stage === 'done' && chatId) {
          router.push(`/chat/${chatId}`);
          toast.success('Chat created!', { id: 'upload-progress' });
        } else {
          toast.loading(stage, { id: 'upload-progress' });
        }
      };

      eventSource.onerror = (err) => {
        console.error('SSE error:', err);
        eventSource.close();
      };
    } catch (error: any) {
      toast.error(
        'Oops! We encountered an error, but your chat has been created.',
      );
      router.push(`/chats`);
      console.log(error);
    } finally {
      setIsUploadingLink(false);
      setIsUploading(false);
    }
  };

  if (isUploadingLink || isUploading || isLearning) {
    return (
      <div className="flex items-center justify-center flex-col gap-2 w-full h-full">
        <img
          src="/images/creating-chat.gif"
          className="w-[500px] h-[400px] min-w-[200px] rounded-lg"
          alt="creating chat"
          width={500}
          height={500}
        />
        <h4 className={`text-xl font-semibold ${loadingTextClassName}`}>
          Please wait a moment, we are cooking up your file...
        </h4>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 p-2 rounded-xl h-2xl ${className}`}>
      <div className="relative h-[300px]">
        <div
          {...getRootProps({
            className: `border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col h-[300px] ${isGuestUploaded ? 'blur-sm' : ''}`,
          })}
        >
          <input
            disabled={
              isLearning || isUploadingLink || isUploading || isGuestUploaded
            }
            {...getInputProps()}
          />
          {isUploading ? (
            <>
              {/* <Loader2 className="w-10 h-10 text-slate-400 animate-spin" /> */}
              <p className="mt-2 text-sm text-slate-500">
                Uploading your file {progress}%...
              </p>
              <Progress value={progress} className="w-full" />
            </>
          ) : isLearning ? (
            <>
              <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
              <p className="mt-2 text-md text-slate-500">AI is learning...</p>
            </>
          ) : (
            <>
              <Inbox className="w-12 h-12 text-slate-400" />
              <p className="mt-2 text-lg text-center text-slate-500">
                {msg
                  ? msg
                  : 'Drop your file in .pptx, .docx, .txt or .pdf here.'}
              </p>
            </>
          )}
        </div>
        {isGuestUploaded && (
          <div
            style={{ backdropFilter: 'blur(0px)' }}
            className="absolute top-0 flex justify-center items-center w-full h-full"
          >
            <Button
              onClick={() => router.push('/sign-up')}
              className="bg-primary text-white px-6 py-6 text-xl font-semibold rounded-md"
            >
              Create your account to upload unlimited files 🚀
            </Button>
          </div>
        )}
      </div>

      {!noIncludeLink && (
        <>
          <div className="flex items-center gap-1 my-2 w-full">
            <Separator className="flex-[1]" />
            <h6>Or</h6>
            <Separator className="flex-[1]" />
          </div>

          <h4 className="text-lg">URL Link</h4>
          <div className="flex gap-1 items-center">
            <Input
              value={url}
              onChange={(e: any) => setUrl(e.target.value)}
              type="text"
              placeholder="Enter your link here..."
            />
            <Button
              disabled={!url || isUploading || isUploadingLink || isLearning}
              onClick={uploadLink}
              className="text-white"
            >
              {isUploadingLink ? 'AI is learning...' : 'Submit'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default FileUpload;
