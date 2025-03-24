'use client';

import { uploadToS3 } from '@/lib/s3';
import { useMutation } from '@tanstack/react-query';
import { Inbox, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Progress } from './ui/progress';

const FileUpload = () => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isLearning, setIsLearning] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const { mutate } = useMutation({
    mutationFn: async ({
      fileKey,
      fileName,
    }: {
      fileKey: string;
      fileName: string;
    }) => {
      const response = await axios.post('/api/create-chat', {
        fileKey,
        fileName,
      });
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
        '.docx',
      ],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': [
        '.pptx',
      ],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        // Bigger than 10MB
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
        mutate(data, {
          onSuccess: ({ chatId }) => {
            toast.success('Chat Created');
            router.push(`/chat/${chatId}`);
          },
          onError: (error: any) => {
            toast.error(
              'Oops! We encountered an error, but your chat has been created.',
            );
            router.push(`/chat/${error.chatId}`);
            console.log(error);
          },
        });
        setIsUploading(false);
        setIsLearning(false);
      } catch (error) {
        console.log(error);
        setIsUploading(false);
        setIsLearning(false);
      }
    },
  });

  return (
    <div className="p-2 bg-white rounded-xl h-2xl">
      <div
        {...getRootProps({
          className:
            'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col',
        })}
      >
        <input {...getInputProps()} />
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
            <p className="mt-2 text-sm text-slate-500">AI is learning...</p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-slate-400" />
            <p className="mt-2 text-sm text-center text-slate-500">
              Drop PDF Here
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
