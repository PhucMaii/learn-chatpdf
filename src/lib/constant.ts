import {
  ArrowUpWideNarrowIcon,
  BookCopyIcon,
  ClockArrowDownIcon,
  ContactRound,
  // FacebookIcon,
  GraduationCapIcon,
  InstagramIcon,
  MailIcon,
  MessageCircleMoreIcon,
  NotebookIcon,
  NotebookPenIcon,
  ShieldCheckIcon,
} from 'lucide-react';
import { IFeature } from './type';

export const tabs = [
  {
    title: 'Chats',
    icon: MessageCircleMoreIcon,
    url: '/chats',
    params: 'chats',
  },
  {
    title: 'Flash Cards',
    icon: BookCopyIcon,
    url: '/flash-cards',
    params: 'flash-cards',
  },
  {
    title: 'Contact Us',
    icon: ContactRound,
    url: '/contact-us',
    params: 'contact-us',
  },
];

export const pricingTabs = [
  {
    title: 'Weekly',
    price: 1.99,
    plan: 'week',
    displayPrice: 1.99,
    displayPlan: 'week',
  },
  {
    title: 'Annually',
    price: 35.88,
    plan: 'year',
    isPopular: true,
    save: ['Save 75% vs weekly 💸', 'Save 33% vs monthly 💸'],
    displayPrice: 2.99,
    displayPlan: 'month',
  },
  {
    title: 'Monthly',
    price: 4.99,
    plan: 'month',
    save: ['Save up to 55% vs weekly 💸'],
    displayPrice: 4.99,
    displayPlan: 'month',
  },
];

export const MAX_FILE_UPLOAD_IN_TRIAL = 2;

export const flashCardResults = [
  {
    text: 'Congratulations, you have aced all the flash cards!',
    percentage: 100,
    icon: '🎉',
  },
  {
    text: 'Almost there! Just a few more to go!',
    percentage: 80,
    icon: '🚀',
  },
  {
    text: 'Not bad! Lets try again to get some more practice!',
    percentage: 50,
    icon: '💪',
  },
  {
    text: 'Not quite there yet, but you can do it better!',
    percentage: 20,
    icon: '✊',
  },
  {
    text: 'I know you can do it! Keep up the good work!',
    percentage: 0,
    icon: '👍',
  },
];

export const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Mandarin",
  "Hindi",
  "Portuguese",
  "Russian",
  "Japanese",
  "Korean",
  "Arabic",
  "Italian",
  "Dutch",
  "Swedish",
  "Turkish",
  "Persian",
  "Polish",
  "Danish",
  "Norwegian",
  "Finnish",
  "Greek",
  "Hebrew",
  "Thai",
  "Indonesian",
  "Vietnamese"
];

export const features: IFeature[] = [
  {
    title: 'Flash Cards',
    description: 'Transform your PDF files into dynamic flashcards designed to empower students and elevate their learning journey!',
    image: '/images/feature-summary/flashcard.jpeg',
  },
  {
    title: 'Multi-language chat',
    description: 'Our application breaks down language barriers, empowering everyone to solve their problems seamlessly in their own language.',
    image: '/images/feature-summary/multi-language.jpeg',
  },
  {
    title: 'Chat with PDFs',
    description: 'Meet your smartest, fastest study partner—delivering instant answers to all your questions, outpacing your classmates every time!',
    image: '/images/feature-summary/chatpdf.jpeg',
  },
]

export const featureDetails = [
  {
    title: 'Flash Card Usage 🔖',
    description: 'Boost your learning with flashcards! Research shows that students using flashcards can achieve up to 50% higher scores compared to traditional study methods. Level up your study game today!',
    image: '/images/features-details/flashcard.jpeg',
  },
  {
    title: 'Chat in your own language 🌎',
    description: 'Feeling homesick in a new country? Connect with experts in your native language for instant comfort, support, and understanding.',
    image: '/images/features-details/multi-language.jpeg',
  },
  {
    title: 'Chat with your PDF 💬',
    description: `Struggling with time consuming PDFs at school? Our 'Chat with your PDF' feature makes tackling homework faster and easier, delivering the same or even better quality results in a fraction of the time.`,
    image: '/images/features-details/multi-language.jpeg',
  },
]

export const gainList = [
  {
    icon: ClockArrowDownIcon,
    title: 'Save Time And Effort',
    description: 'Skip the hassle of sifting through lengthy PDFs. Get instant answers and summaries to focus on what truly matters—understanding the material.',
  },
  {
    icon: BookCopyIcon,
    title: 'Ace Your Homework Faster',
    description: 'Breeze through assignments with AI-powered tools that deliver high-quality results in a fraction of the time.',
  },
  {
    icon: NotebookIcon,
    title: 'Turn Notes Into Flashcards',
    description: 'Generate smart, customizable flashcards from your PDFs with a single click. Study more effectively with tools tailored to your needs.',
  },
  {
    icon: NotebookPenIcon,
    title: 'Stay Organized & Prepared',
    description: 'Simplify your study process by turning overwhelming PDF files into digestible insights and structured learning aids.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Boost Retention and Grades',
    description: 'With quick answers and personalized flashcards, you’ll retain information better and perform with confidence in class or exams.',
  },
  {
    icon: GraduationCapIcon,
    title: 'Study Anywhere, Anytime',
    description: 'Access your notes, PDFs, and flashcards on the go. Your study tools are now as mobile as you are.',
  },
  {
    icon: ArrowUpWideNarrowIcon,
    title: 'Enhance Productivity',
    description: 'Transform tedious study sessions into efficient, focused learning experiences that leave you more time for what you love.',
  },
];

export const contactList = [
  {
    icon: MailIcon,
    title: 'Contact us',
    link: 'mailto:maithienphuc0102@gmail.com',
  },
  {
    icon: InstagramIcon,
    title: 'Instagram',
    link: 'https://www.instagram.com/_tpismeee_/',
  },
  // {
  //   icon: FacebookIcon,
  //   title: 'Facebook',
  //   link: 'https://www.facebook.com/PhucMai',
  // },
  
]

export const greyBackground = "bg-[#f1f1f1]";

export const daysOfTrial = 3;