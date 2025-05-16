import { DrizzleStudyGuide } from '@/lib/db/drizzleType';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import LoadingComponent from '../LoadingComponent';
import ReactMarkdown from 'react-markdown';
import EmptyDisplay from '../EmptyDisplay';
import { Button } from '../ui/button';
import RichTextEditor from '../RichTextEditor';
import useLocalStorage from '../../../hooks/useLocalStorage';

export default function StudyGuide() {
  const { id: projectId } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [guestSession, setGuestSession, isInitialized] = useLocalStorage(
    'guest-session',
    {},
  );

  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [studyGuide, setStudyGuide] = useState<DrizzleStudyGuide | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isInitialized) {
      fetchStudyGuide();
    }
  }, [isInitialized]);

  console.log(studyGuide, 'studyGuide');

  const fetchStudyGuide = async () => {
    try {
      const response = await axios.get(
        `/api/study-guide?projectId=${projectId}&guestSessionId=${guestSession?.sessionId}`,
      );

      if (response.data.data) {
        setStudyGuide(response.data.data);
      }
    } catch (error: any) {
      console.log('Something went wrong in fetching cheat sheet', error);
      toast.error('Something went wrong in fetching cheat sheet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStudyGuide = async () => {
    setIsAdding(true);
    try {
      const response = await axios.post(
        `/api/study-guide?guestSessionId=${guestSession?.sessionId}`,
        {
          projectId,
        },
      );

      if (response.data.error) {
        toast.error('Something went wrong in creating study guide');
        return;
      }

      await fetchStudyGuide();
      toast.success('Study guide created successfully');
    } catch (error: any) {
      console.log('Something went wrong in creating study guide', error);
      toast.error('Something went wrong in creating study guide');
    } finally {
      setIsAdding(false);
    }
  };

  const handleSaveStudyGuide = async (updatedContent: string) => {
    try {
      const response = await axios.put(
        `/api/study-guide?guestSessionId=${guestSession?.sessionId}`,
        {
          projectId,
          updatedContent,
        },
      );

      if (response.data.error) {
        toast.error('Something went wrong in saving study guide');
        return;
      }

      toast.success('Study guide saved successfully');

      await fetchStudyGuide();
    } catch (error: any) {
      console.log('Something went wrong in saving study guide', error);
      toast.error('Something went wrong in saving study guide');
    } finally {
      setIsEditMode(false);
    }
  };

  return (
    <div className="flex flex-col w-full mx-auto md:w-xl lg:w-2xl xl:w-4xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl justify-start">Study Guide</h1>
        <Button variant="outline" onClick={() => setIsEditMode(!isEditMode)}>
          {isEditMode ? 'View' : 'Edit'}
        </Button>
      </div>

      {isLoading ? (
        <LoadingComponent />
      ) : studyGuide && isEditMode ? (
        <RichTextEditor
          content={studyGuide.content}
          handleSaveStudyGuide={handleSaveStudyGuide}
        />
      ) : studyGuide && !isEditMode ? (
        <div className="font-sans font-regular leading-[1.7]">
          <ReactMarkdown>{studyGuide.content}</ReactMarkdown>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <EmptyDisplay
            src="/images/no-flashcard.png"
            text="You haven't created your own study guide yet. Let's create one!"
          />
          <Button
            disabled={isAdding}
            onClick={handleCreateStudyGuide}
            className="px-6 py-4 text-lg font-semibold"
          >
            {isAdding ? 'Creating...' : 'Create Study Guide'}
          </Button>
        </div>
      )}
    </div>
  );
}
