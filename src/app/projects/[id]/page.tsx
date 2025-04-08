'use client';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  PlayCircle,
  BookOpen,
  Image as ImageIcon,
  FoldersIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Media from '@/components/Projects/Media';
import Flashcards from '@/components/Projects/Flashcards';
import ChatWithAI from '@/components/Projects/ChatWithAI';
import ExamMode from '@/components/Projects/ExamMode';

export default function ProjectDisplayPage() {
  const [selectedTab, setSelectedTab] = useState('medias');

  const router = useRouter();

  return (
    <div className="grid grid-cols-12 max-w-[1920px] mx-auto h-screen bg-white text-gray-900">
      {/* Sidebar */}
      <aside className="col-span-2 max-w-[300px] p-4 border-1 border-gray-100 flex flex-col gap-2">
        {/* <div> */}
          <Button className="justify-start gap-2" variant="ghost" onClick={() => router.push('/projects')}>
            <FoldersIcon className="w-5 h-5" />
            <h6>Projects</h6>
          </Button>
        {/* </div> */}
        <h2 className="text-xl font-semibold mb-2">Explore</h2>
        <Button
          variant={selectedTab === 'chat' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('chat')}
          className="justify-start gap-2"
        >
          <MessageSquare className="w-5 h-5" /> Chat with AI
        </Button>
        <Button
          variant={selectedTab === 'medias' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('medias')}
          className="justify-start gap-2"
        >
          <ImageIcon className="w-5 h-5" /> Media
        </Button>
        <Button
          variant={selectedTab === 'flashcards' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('flashcards')}
          className="justify-start gap-2"
        >
          <BookOpen className="w-5 h-5" /> Flashcards
        </Button>
        <Button
          variant={selectedTab === 'exam' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('exam')}
          className="justify-start gap-2"
        >
          <PlayCircle className="w-5 h-5" /> Exam Mode
        </Button>
      </aside>

      {/* Main Content */}
      <main className="col-span-10 p-6 overflow-auto">
        <Tabs value={selectedTab} className="w-full">
          <TabsList className="hidden">
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
            <TabsTrigger value="medias">Media</TabsTrigger>
            <TabsTrigger value="chat">Chat with AI</TabsTrigger>
            <TabsTrigger value="exam">Exam Mode</TabsTrigger>
          </TabsList>

          <TabsContent value="medias">
            {/* <Card>
              <CardContent className="p-6">
                Media content goes here.
              </CardContent>
            </Card> */}
            <Media />
          </TabsContent>

          <TabsContent value="flashcards">
            <Flashcards />
          </TabsContent>

          <TabsContent value="chat">
            <ChatWithAI />
          </TabsContent>

          <TabsContent value="exam">
            <ExamMode />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
