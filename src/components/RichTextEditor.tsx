import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './MenuBar';
import { marked } from 'marked';
import { Button } from './ui/button';
import TurndownService from 'turndown';

export default function RichTextEditor({
  content,
  handleSaveStudyGuide,
}: {
  content: string;
  handleSaveStudyGuide?: (updatedContent: string) => void;
}) {
  const [editorContent, setEditorContent] = useState(marked(content));

  const handleEditorUpdate = (newContent: string) => {
    setEditorContent(newContent);
  };

  const extensions = [
    StarterKit.configure({
      bulletList: {
        HTMLAttributes: {
          class: 'list-disc ml-3',
        },
      },
      orderedList: {
        HTMLAttributes: {
          class: 'list-decimal ml-3',
        },
      },
    }),
  ];

  const editor = useEditor({
    extensions,
    content: editorContent,
    onUpdate: ({ editor }) => {
      handleEditorUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'outline-none border-none font-sans leading-[2] focus:outline-none focus:border-transparent bg-transparent',
      },
    },
  });

  const turndownService = new TurndownService();

  const handleSave = () => {
    const htmlContent = editor?.getHTML() || '';
    const markdownContent = turndownService.turndown(htmlContent);
    if (handleSaveStudyGuide) {
      handleSaveStudyGuide(markdownContent);
    }
  };

  return (
    <div className="bg-gray-100 border border-gray-400 rounded-md p-4 focus:outline-none focus:border-transparent">
      {handleSaveStudyGuide && <div className="flex justify-end gap-2 mb-4">
        <Button  onClick={handleSave}>Save</Button>
      </div>}
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
