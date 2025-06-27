'use client';
import { useEffect, useState, useCallback, memo } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  BookOpen,
  Image as ImageIcon,
  FoldersIcon,
  NotepadTextIcon,
  FileTextIcon,
  FileQuestionIcon,
} from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Media from '@/components/Projects/Media';
import Flashcards from '@/components/Projects/Flashcards';
import ChatWithAI from '@/components/Projects/ChatWithAI';
import StudyGuide from '@/components/Projects/StudyGuide';
import axios from 'axios';
import useLocalStorage from '../../../../hooks/useLocalStorage';
import LoadingComponent from '@/components/LoadingComponent';
import toast from 'react-hot-toast';
import Essay from '@/components/Projects/Essay';
import QuizSummary from '@/components/Projects/QuizSummary';

// Memoized tab button component for better performance
const TabButton = memo(({ 
  tab, 
  isActive, 
  onClick, 
  icon: Icon, 
  label 
}: {
  tab: string;
  isActive: boolean;
  onClick: (tab: string) => void;
  icon: any;
  label: string;
}) => (
  <Button
    variant={isActive ? 'default' : 'ghost'}
    onClick={() => onClick(tab)}
    className="justify-start gap-2 transition-all duration-150"
  >
    <Icon className="w-5 h-5" />
    <span className="hidden sm:block">{label}</span>
  </Button>
));

export default function ProjectDetails() {
  const { id } = useParams();
  const params = useSearchParams();
  const tab = params?.get('tab');

  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState(tab || 'chat');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [guestSession, setGuestSession, isInitialized] = useLocalStorage(
    'guest-session',
    {},
  );
  const [loading, setLoading] = useState<any>({
    flashcards: false,
    chat: false,
    studyGuide: false,
    essay: false,
    quiz: false,
  });

  const router = useRouter();

  // Handle URL tab parameter changes - only when tab actually changes
  useEffect(() => {
    if (tab && tab !== selectedTab) {
      setSelectedTab(tab);
    } else if (!tab) {
      router.push(`/projects/${id}?tab=chat`);
    }
  }, [tab, router, id]);

  // Handle tab selection changes - optimized for responsiveness
  const handleTabChange = useCallback((newTab: string) => {
    // Immediately update local state for instant feedback
    setSelectedTab(newTab);
    
    // Update URL without waiting for router
    const url = `/projects/${id}?tab=${newTab}`;
    window.history.pushState({}, '', url);
    
    // Use router.replace for faster navigation without adding to history
    router.replace(url);
  }, [router, id]);

  useEffect(() => {
    if (isInitialized) {
      checkProjectOwner();
    }
  }, [isInitialized]);

  useEffect(() => {
    fetchProject();
  }, []);

  const checkProjectOwner = async () => {
    // setIsChecking(true);
    try {
      await axios.post(`/api/project/check-owner`, {
        guestSessionId: guestSession.sessionId,
        projectId: id,
      });

      setIsChecking(false);
    } catch (error: any) {
      console.log(error);
      router.push('/');
    }
  };

  const fetchProject = async () => {
    try {
      await axios.get(`/api/project?id=${id}`);
      // const project = response.data.data;

      // if (!project?.medias || project.medias.length === 0) {
      //   setSelectedTab('medias');
      // }
    } catch (error: any) {
      console.log(error);
      toast.error('Failed to fetch project');
    }
  };

  if (isChecking) {
    return <LoadingComponent />;
  }

  return (
    <div className="grid grid-cols-12 max-w-[1920px] mx-auto h-screen bg-white text-gray-900">
      {/* Sidebar */}
      <aside className="sticky top-0 h-screen col-span-2 max-w-[300px] p-4 border-1 border-gray-100 flex flex-col gap-2">
        <Button
          className="justify-start gap-2"
          variant="ghost"
          onClick={() => router.push('/projects')}
          name="projects"
        >
          <FoldersIcon className="w-5 h-5" />
          <h6 className="hidden sm:block">Projects</h6>
        </Button>
        <h2 className="text-xl font-semibold mb-2 hidden sm:block">Explore</h2>
        <TabButton
          tab="chat"
          isActive={selectedTab === 'chat'}
          onClick={handleTabChange}
          icon={MessageSquare}
          label="Chat with AI"
        />
        <TabButton
          tab="medias"
          isActive={selectedTab === 'medias'}
          onClick={handleTabChange}
          icon={ImageIcon}
          label="Media"
        />
        <TabButton
          tab="flashcards"
          isActive={selectedTab === 'flashcards'}
          onClick={handleTabChange}
          icon={BookOpen}
          label="Flashcards"
        />
        <TabButton
          tab="studyGuide"
          isActive={selectedTab === 'studyGuide'}
          onClick={handleTabChange}
          icon={NotepadTextIcon}
          label="Study Guide"
        />
        <TabButton
          tab="essay"
          isActive={selectedTab === 'essay'}
          onClick={handleTabChange}
          icon={FileTextIcon}
          label="Essay"
        />
        <TabButton
          tab="quizzes"
          isActive={selectedTab === 'quizzes'}
          onClick={handleTabChange}
          icon={FileQuestionIcon}
          label="Quizzes"
        />
      </aside>

      {/* Main Content */}
      <main className="col-span-10 px-6 pt-4 h-screen overflow-y-auto">
        <Tabs value={selectedTab || 'chat'} className="w-full">
          <TabsList className="hidden">
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
            <TabsTrigger value="medias">Media</TabsTrigger>
            <TabsTrigger value="chat">Chat with AI</TabsTrigger>
            <TabsTrigger value="exam">Exam Mode</TabsTrigger>
          </TabsList>

          <TabsContent value="medias">
            <Media setLoading={setLoading} />
          </TabsContent>

          <TabsContent value="flashcards">
            <Flashcards loading={loading.flashcards} />
          </TabsContent>

          <TabsContent value="chat">
            <ChatWithAI />
          </TabsContent>

          <TabsContent value="studyGuide">
            <StudyGuide />
          </TabsContent>

          <TabsContent value="essay">
            <Essay />
          </TabsContent>

          <TabsContent value="quizzes">
            {/* <Quizzes loading={loading.quiz} /> */}
            <QuizSummary loading={loading.quiz} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
