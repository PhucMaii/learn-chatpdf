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
  ArrowLeft,
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
import { tabsInProjectDetails } from '@/lib/constant';
import Summary from '@/components/Projects/Summary';

// Memoized tab button component for better performance
// eslint-disable-next-line react/display-name
const TabButton = memo(
  ({
    tab,
    isActive,
    onClick,
    icon: Icon,
    label,
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
      className="justify-start gap-2 transition-all duration-150 md:w-full"
    >
      <Icon className="w-5 h-5" />
      <span className="hidden sm:block md:block">{label}</span>
    </Button>
  ),
);

// Mobile tab button component
// eslint-disable-next-line react/display-name
const MobileTabButton = memo(
  ({
    tab,
    isActive,
    onClick,
    icon: Icon,
    label,
  }: {
    tab: string;
    isActive: boolean;
    onClick: (tab: string) => void;
    icon: any;
    label: string;
  }) => (
    <button
      onClick={() => onClick(tab)}
      className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-150 ${
        isActive
          ? 'bg-primary text-primary-foreground text-white font-semibold'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      <Icon className="w-5 h-5 mb-1" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  ),
);

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
  const handleTabChange = useCallback(
    (newTab: string) => {
      // Immediately update local state for instant feedback
      setSelectedTab(newTab);

      // Update URL without waiting for router
      const url = `/projects/${id}?tab=${newTab}`;
      window.history.pushState({}, '', url);

      // Use router.replace for faster navigation without adding to history
      router.replace(url);
    },
    [router, id],
  );

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
    <div className="bg-white text-gray-900">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/projects')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Projects</span>
          </Button>
          <h1 className="text-lg font-semibold">Project Details</h1>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-12 max-w-[1920px] mx-auto h-screen">
        {/* Desktop Sidebar */}
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
          <h2 className="text-xl font-semibold mb-2 hidden sm:block">
            Explore
          </h2>
          {tabsInProjectDetails.map((tab) => (
            <TabButton
              key={tab.params}
              tab={tab.params}
              isActive={selectedTab === tab.params}
              onClick={handleTabChange}
              icon={tab.icon}
              label={tab.title}
            />
          ))}
          {/* <TabButton
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
          /> */}
        </aside>

        {/* Desktop Main Content */}
        <main className="col-span-10 px-6 pt-4 h-screen overflow-y-auto">
          <Tabs value={selectedTab || 'chat'} className="w-full">
            <TabsList className="hidden">
              {tabsInProjectDetails.map((tab) => (
                <TabsTrigger key={tab.params} value={tab.params}>
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="summary">
              <Summary />
            </TabsContent>

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

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-screen">
        {/* Mobile Main Content */}
        <main className="flex-1 px-4 pt-2 pb-20 overflow-y-auto">
          <Tabs value={selectedTab || 'chat'} className="w-full">
            <TabsList className="hidden">
              <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
              <TabsTrigger value="medias">Media</TabsTrigger>
              <TabsTrigger value="chat">Chat with AI</TabsTrigger>
              <TabsTrigger value="exam">Exam Mode</TabsTrigger>
            </TabsList>

            <TabsContent value="medias" className="mt-2">
              <Media setLoading={setLoading} />
            </TabsContent>

            <TabsContent value="flashcards" className="mt-2">
              <Flashcards loading={loading.flashcards} />
            </TabsContent>

            <TabsContent value="chat" className="mt-2">
              <ChatWithAI />
            </TabsContent>

            <TabsContent value="studyGuide" className="mt-2">
              <StudyGuide />
            </TabsContent>

            <TabsContent value="essay" className="mt-2">
              <Essay />
            </TabsContent>

            <TabsContent value="quizzes" className="mt-2">
              {/* <Quizzes loading={loading.quiz} /> */}
              <QuizSummary loading={loading.quiz} />
            </TabsContent>
          </Tabs>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 safe-area-bottom z-100">
          <div className="grid grid-cols-6 gap-1 max-w-md mx-auto">
            <MobileTabButton
              tab="chat"
              isActive={selectedTab === 'chat'}
              onClick={handleTabChange}
              icon={MessageSquare}
              label="Chat"
            />
            <MobileTabButton
              tab="medias"
              isActive={selectedTab === 'medias'}
              onClick={handleTabChange}
              icon={ImageIcon}
              label="Media"
            />
            <MobileTabButton
              tab="flashcards"
              isActive={selectedTab === 'flashcards'}
              onClick={handleTabChange}
              icon={BookOpen}
              label="Cards"
            />
            <MobileTabButton
              tab="studyGuide"
              isActive={selectedTab === 'studyGuide'}
              onClick={handleTabChange}
              icon={NotepadTextIcon}
              label="Study"
            />
            <MobileTabButton
              tab="essay"
              isActive={selectedTab === 'essay'}
              onClick={handleTabChange}
              icon={FileTextIcon}
              label="Essay"
            />
            <MobileTabButton
              tab="quizzes"
              isActive={selectedTab === 'quizzes'}
              onClick={handleTabChange}
              icon={FileQuestionIcon}
              label="Quiz"
            />
          </div>
        </nav>
      </div>
    </div>
  );
}
