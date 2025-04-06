'use client'
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, PlayCircle, BookOpen, Image as ImageIcon } from "lucide-react";

export default function ProjectDisplayPage() {
  const [selectedTab, setSelectedTab] = useState("medias");

  return (
    <div className="grid grid-cols-12 h-screen bg-white text-gray-900">
      {/* Sidebar */}
      <aside className="col-span-2 max-w-[300px] p-4 border-1 border-gray-100 flex flex-col gap-4">
        <h2 className="text-xl font-semibold mb-2">Explore</h2>
        <Button
          variant={selectedTab === "chat" ? "default" : "ghost"}
          onClick={() => setSelectedTab("chat")}
          className="justify-start gap-2"
        >
          <MessageSquare className="w-5 h-5" /> Chat with AI
        </Button>
        <Button
          variant={selectedTab === "medias" ? "default" : "ghost"}
          onClick={() => setSelectedTab("medias")}
          className="justify-start gap-2"
        >
          <ImageIcon className="w-5 h-5" /> Media
        </Button>
        <Button
          variant={selectedTab === "flashcards" ? "default" : "ghost"}
          onClick={() => setSelectedTab("flashcards")}
          className="justify-start gap-2"
        >
          <BookOpen className="w-5 h-5" /> Flashcards
        </Button>
        <Button
          variant={selectedTab === "exam" ? "default" : "ghost"}
          onClick={() => setSelectedTab("exam")}
          className="justify-start gap-2"
        >
          <PlayCircle className="w-5 h-5" /> Exam Mode
        </Button>
      </aside>

      {/* Main Content */}
      <main className="col-span-10 p-6 overflow-auto">
        <Tabs value={selectedTab} className="w-full">
          <TabsList className="hidden">
            <TabsTrigger value="medias">Media</TabsTrigger>
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
            <TabsTrigger value="chat">Chat with AI</TabsTrigger>
            <TabsTrigger value="exam">Exam Mode</TabsTrigger>
          </TabsList>

          <TabsContent value="medias">
            <Card>
              <CardContent className="p-6">Media content goes here.</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flashcards">
            <Card>
              <CardContent className="p-6">Flashcards will be displayed here.</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <Card>
              <CardContent className="p-6">Interactive chat with AI appears here.</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exam">
            <Card>
              <CardContent className="p-6">Exam mode interface goes here.</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
