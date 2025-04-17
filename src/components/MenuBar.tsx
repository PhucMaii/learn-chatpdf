import {

  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  StrikethroughIcon,
} from 'lucide-react';
import React from 'react';
import { Toggle } from './ui/toggle';

export default function MenuBar({ editor }: { editor: any }) {
  // const {editor} = useCurrentEditor();
  if (!editor) {
    return null;
  }

  const options = [
    {
      icon: <Heading1Icon />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive('heading', { level: 1 }),
    },
    {
      icon: <Heading2Icon />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive('heading', { level: 2 }),
    },
    {
      icon: <Heading3Icon />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive('heading', { level: 3 }),
    },
    {
      icon: 'P',
      onClick: () => editor.chain().focus().setParagraph().run(),
      pressed: editor.isActive('paragraph'),
    },
    {
      icon: <BoldIcon />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive('bold'),
    },
    {
      icon: <ItalicIcon />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive('italic'),
    },
    {
      icon: <StrikethroughIcon />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive('strike'),
    },
    // {
    //   icon: <AlignLeftIcon />,
    //   onClick: () => editor.chain().focus().setTextAlign('left').run(),
    //   pressed: editor.isActive({ textAlign: 'left' }),
    // },
    // {
    //   icon: <AlignCenterIcon />,
    //   onClick: () => editor.chain().focus().setTextAlign('center').run(),
    //   pressed: editor.isActive({ textAlign: 'center' }),
    // },
    // {
    //   icon: <AlignRightIcon />,
    //   onClick: () => editor.chain().focus().setTextAlign('right').run(),
    //   pressed: editor.isActive({ textAlign: 'right' }),
    // },

    {
      icon: <ListIcon />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive('bulletList'),
    },
    {
      icon: <ListOrderedIcon />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive('orderedList'),
    },
    // {
    //   icon: <HighlighterIcon />,
    //   onClick: () => editor.chain().focus().toggleHighlight().run(),
    //   pressed: editor.isActive('highlight'),
    // },
  ];
  return (
    <div className="border rounded-md p-1 mb-1 bg-slate-50 space-x-2 z-50">
      {options.map((option, index) => {
        return (
          <Toggle
            key={index}
            pressed={option.pressed}
            onPressedChange={option.onClick}
            className={`w-6 h-6 bg-transparent focus:bg-emerald-500 focus:text-emerald-500 dark:focus:bg-emerald-500 dark:focus:text-emerald-500 ${option.pressed ? 'bg-emerald-500 text-emerald-500' : ''}`}
          >
            {option.icon}
          </Toggle>
        );
      })}
    </div>
  );
}
