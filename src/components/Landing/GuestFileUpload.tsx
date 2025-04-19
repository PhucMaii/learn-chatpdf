import React, { useState, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-hot-toast'
import { Progress } from '@/components/ui/progress'
import { Inbox, Loader2 } from 'lucide-react'
import { UserContext } from '../../../context/UserProvider'
import { uploadToS3 } from '@/lib/s3'
import useLocalStorage from '../../../hooks/useLocalStorage'
// Define the IProps interface if not already defined
interface IProps {
  noIncludeLink?: boolean;
  className?: string;
  msg?: string;
  projectId?: number | string;
  setDisplay?: (displays: any) => void;
}

const GuestFileUpload = ({
  className,
  msg,
  projectId,
}: IProps) => {
  const router = useRouter();
  const { user }: any = useContext(UserContext);


  const [guestSession] = useLocalStorage('guest-session', {});

  const [isLearning, setIsLearning] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'applications/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        ['.pptx'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 5,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 30 * 1024 * 1024) {
        toast.error('Please upload a smaller file');
        return;
      }

      try {
        setIsUploading(true);
        const dataList = acceptedFiles.map((file) => {
          return uploadToS3(file, setProgress);
        });

        const resolvedData = await Promise.all(dataList);
        setIsUploading(false);
        setTimeout(() => setIsLearning(true), 1);

        if (resolvedData.length === 0) {
          toast.error(
            'Oops! Looks like the file is not uploaded correctly. Please try again later.',
          );
          return;
        }


        const fileListParam = encodeURIComponent(JSON.stringify(resolvedData));
        const eventSource = new EventSource(
          `/api/guest/upload?fileList=${fileListParam}&guestSessionId=${guestSession.sessionId}&guestSessionSignature=${guestSession.signature}`,
        );

        eventSource.onmessage = (event) => {
          const { stage } = JSON.parse(event.data);
          if (stage === 'done') {
            toast.success('Upload Successfully', { id: 'upload-progress' });
            router.push(`/projects/${projectId}`);
          } else {
            toast.loading(stage, { id: 'upload-progress' });
          }
        };

        eventSource.onerror = (err) => {
          console.error('SSE error:', err);
          eventSource.close();
        };
        setIsUploading(false);
        setIsLearning(false);
      } catch (error) {
        console.log(error);
        setIsUploading(false);
        setIsLearning(false);
      } finally {
        setIsUploading(false);
        setTimeout(() => setIsLearning(true), 1);
      }
    },
  });

  if (user?.name) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-2 p-2 rounded-xl h-2xl ${className}`}>
      <div className="relative h-[300px]">
        <div
          {...getRootProps({
            className: `px-4 rounded-xl cursor-pointer bg-white border-2 border-dashed border-emerald-500 py-8 flex justify-center items-center flex-col h-[300px]`,
          })}
        >
          <input
            disabled={
              isLearning || isUploading
            }
            {...getInputProps()}
          />
          {isUploading ? (
            <>
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
              <Inbox className="w-12 h-12 text-emerald-500" />
              <p className="mt-2 text-lg text-center text-emerald-500">
                {msg
                  ? msg
                  : 'Drop your file here to get started! We accept .pptx, .docx, .txt, or .pdf.'}
              </p>
            </>
          )}
        </div>
        {/* {isGuestUploaded && (
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
        )} */}
      </div>
    </div>
  );
};

export default GuestFileUpload;
