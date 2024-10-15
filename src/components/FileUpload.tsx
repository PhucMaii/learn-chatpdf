'use client';

import { uploadToS3 } from '@/lib/s3';
import { useMutation } from '@tanstack/react-query';
import { Inbox, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import {useDropzone} from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';


const FileUpload = () => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const {mutate, isPending} = useMutation({
    mutationFn: async ({fileKey, fileName}: {fileKey: string, fileName: string}) => {
      const response = await axios.post('/api/create-chat', {fileKey, fileName});
      return response.data;
    }
  });

  const {getRootProps, getInputProps} = useDropzone({
    accept: {'applications/pdf': ['.pdf']},
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
        const data = await uploadToS3(file);
        if (!data?.fileKey || !data?.fileName) {
          toast.error('Something went wrong');
          return;
        }
        mutate(data, {
          onSuccess: ({chatId}) => {
            toast.success('Chat Created');
            router.push(`/chat/${chatId}`);
          },
          onError: (error) => {
            toast.error('Error creating chat');
            console.log(error);
          }
        });
        console.log(data, 'data');
        setIsUploading(false);
      } catch (error) {
        console.log(error);
        setIsUploading(false);
      }
    }  });

  return (
    <div className="p-2 bg-white rounded-xl h-2xl">
      <div {...getRootProps({
        className: 'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col'
      })}>
        <input {...getInputProps()} />
        {
          isUploading || isPending ? (
          <>
            <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
            <p className="mt-2 text-sm text-slate-500">Spilling Tea to GPT...</p>
          </>
          ) : (
            <>
            <Inbox className="w-10 h-10 text-slate-400" />
            <p className="mt-2 text-sm text-center text-slate-500">Drop PDF Here</p>
          </>
          )
        }

      </div>
    </div>
  )
}

export default FileUpload