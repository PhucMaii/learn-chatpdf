'use client';
import React, { useEffect, useState } from 'react';
import FileUpload from '../FileUpload';
import BorderSection from '../BorderSection';
import MediasTable from '../Tables/MediasTable';
import { DrizzleMedia } from '@/lib/db/drizzleType';
import EmptyDisplay from '../EmptyDisplay';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams } from 'next/navigation';
import useLocalStorage from '../../../hooks/useLocalStorage';
import YoutubeLinkUpload from '../YoutubeLinkUpload';
import { Separator } from '../ui/separator';

interface IProps {
  setLoading: any;
}

export default function Media({ setLoading }: IProps) {
  const { id: projectId } = useParams() ?? { id: null };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [guestSession, setGuestSession, isInitialized] = useLocalStorage(
    'guest-session',
    {},
  );

  const [medias, setMedias] = useState<DrizzleMedia[]>([]);

  useEffect(() => {
    if (isInitialized) {
      fetchMedias();
    }
  }, [isInitialized]);

  const fetchMedias = async () => {
    try {
      const response = await axios.get(
        `/api/media?projectId=${projectId}&guestSessionId=${guestSession?.sessionId}`,
      );
      const data = response.data.medias;
      setMedias(data);
    } catch (error) {
      console.error('Error fetching medias:', error);
      toast.error('Something went wrong in fetching medias');
    }
  };

  if (!projectId) {
    return <div>Project ID is not available</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold justify-start">Media</h1>

      <BorderSection>
        <h4 className="px-4 font-medium text-lg">Upload Medias</h4>
        <YoutubeLinkUpload
          projectId={Number(projectId)}
          setDisplay={setMedias}
        />
        <Separator className="my-4" />
        <FileUpload
          projectId={projectId?.toString()}
          setDisplay={setMedias}
          noIncludeLink
          setLoading={setLoading}
        />
      </BorderSection>

      <BorderSection>
        <h4 className="px-4 font-medium text-lg">Your Medias</h4>
        {medias.length > 0 ? (
          <MediasTable medias={medias} setMedias={setMedias} />
        ) : (
          <EmptyDisplay
            src="/images/no-projects.png"
            text="You haven't created any media yet. Let's add the first one!"
          />
        )}
      </BorderSection>
    </div>
  );
}
