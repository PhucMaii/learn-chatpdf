import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './MenuBar';
import { marked } from 'marked';

export default function RichTextEditor({ content }: { content: string }) {
  const [editorContent, setEditorContent] = useState(marked(content));

  const handleEditorUpdate = (newContent: string) => {
    setEditorContent(newContent);
    console.log('Updated Content:', newContent);
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
        class: 'outline-none border-none font-sans leading-[2] focus:outline-none focus:border-transparent bg-transparent',
      },
    },
  });

  return (
    <div className="bg-gray-100 border border-gray-400 rounded-md p-4 focus:outline-none focus:border-transparent">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
