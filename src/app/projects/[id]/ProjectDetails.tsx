'use client';
import { useEffect, useState } from 'react';
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
import { useParams, useRouter } from 'next/navigation';
import Media from '@/components/Projects/Media';
import Flashcards from '@/components/Projects/Flashcards';
import ChatWithAI from '@/components/Projects/ChatWithAI';
import StudyGuide from '@/components/Projects/StudyGuide';
import axios from 'axios';
import useLocalStorage from '../../../../hooks/useLocalStorage';
import LoadingComponent from '@/components/LoadingComponent';
import toast from 'react-hot-toast';
import Essay from '@/components/Projects/Essay';
import Quizzes from '@/components/Projects/Quizzes';

export default function ProjectDetails() {
  const { id } = useParams();

  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState('chat');
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
      const response = await axios.get(`/api/project?id=${id}`);
      const project = response.data.data;

      if (!project?.medias || project.medias.length === 0) {
        setSelectedTab('medias');
      }
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
        <Button
          variant={selectedTab === 'chat' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('chat')}
          className="justify-start gap-2"
          name="chat"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="hidden sm:block">Chat with AI</span>
        </Button>
        <Button
          variant={selectedTab === 'medias' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('medias')}
          className="justify-start gap-2"
          name="medias"
        >
          <ImageIcon className="w-5 h-5" />
          <span className="hidden sm:block">Media</span>
        </Button>
        <Button
          variant={selectedTab === 'flashcards' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('flashcards')}
          className="justify-start gap-2"
          name="flashcards"
        >
          <BookOpen className="w-5 h-5" />
          <span className="hidden sm:block">Flashcards</span>
        </Button>
        <Button
          variant={selectedTab === 'studyGuide' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('studyGuide')}
          className="justify-start gap-2"
          name="studyGuide"
        >
          <NotepadTextIcon className="w-5 h-5" />
          <span className="hidden sm:block">Study Guide</span>
        </Button>
        <Button
          variant={selectedTab === 'essay' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('essay')}
          className="justify-start gap-2"
          name="essay"
        >
          <FileTextIcon className="w-5 h-5" />
          <span className="hidden sm:block">Essay</span>
        </Button>
        <Button
          variant={selectedTab === 'quizzes' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('quizzes')}
          className="justify-start gap-2"
        >
          <FileQuestionIcon className="w-5 h-5" /> Quizzes
        </Button>
      </aside>

      {/* Main Content */}
      <main className="col-span-10 px-6 pt-4 h-screen overflow-y-auto">
        <Tabs value={selectedTab} className="w-full">
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
            <Quizzes loading={loading.quiz} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
