import {
  ArrowUpWideNarrowIcon,
  BookCopyIcon,
  ClockArrowDownIcon,
  ContactRound,
  CrownIcon,
  FoldersIcon,
  // FacebookIcon,
  GraduationCapIcon,
  InstagramIcon,
  MailIcon,
  // MessageCircleMoreIcon,
  NotebookIcon,
  NotebookPenIcon,
  PersonStandingIcon,
  RocketIcon,
  ShieldCheckIcon,
  TwitterIcon,
} from 'lucide-react';
import { IFeature } from './type';

export const tabs = [
  {
    title: 'Projects',
    icon: FoldersIcon,
    url: '/projects',
    params: 'projects',
  },
  // {
  //   title: 'Chats',
  //   icon: MessageCircleMoreIcon,
  //   url: '/chats',
  //   params: 'chats',
  // },
  // {
  //   title: 'Flash Cards',
  //   icon: BookCopyIcon,
  //   url: '/flash-cards',
  //   params: 'flash-cards',
  // },
  {
    title: 'Contact Us',
    icon: ContactRound,
    url: '/contact-us',
    params: 'contact-us',
  },
];

export const pricingTabs = [
  {
    title: 'Starter',
    price: 0,
    icon: PersonStandingIcon,
    // plan: 'week',
    displayMonthlyPrice: 'Free',
    displayYearlyPrice: 'Free',
    forWho:
      'Just getting started with AI? Try it out and see how it fits your study flow.',
    // displayPlan: 'week',
    features: [
      '3 free projects',
      'Unlimited AI chat',
      'Unlimited file upload',
      'Unlimited Essays Generator',
      'Unlimited Flashcards Generator',
      'Unlimited Study Guides Generator',
    ],
  },
  {
    title: 'Pro',
    icon: RocketIcon,
    monthlyPrice: 2.99,
    yearlyPrice: 29.99,
    plan: 'month',
    forWho:
      'Busy student? Stay on top of school with AI that saves time and cuts stress.',
    isPopular: true,
    displayMonthlyPrice: '$2.99',
    displayYearlyPrice: '$2.49',
    features: [
      'Unlimited projects',
      'Unlimited AI chat',
      'Unlimited file upload',
      'Unlimited AI Detectable',
      'Unlimited Essays Generator',
      'Unlimited Flashcards Generator',
      'Unlimited Study Guides Generator',
    ],
  },
  {
    title: 'Elite',
    icon: CrownIcon,
    monthlyPrice: 5.99,
    yearlyPrice: 59.99,
    plan: 'month',
    forWho:
      'Want it all? Go unlimited and study your way, no limits, no burnout.',
    displayMonthlyPrice: '$5.99',
    displayYearlyPrice: '$4.99',
    features: [
      'Unlimited projects',
      'Unlimited AI chat',
      'Unlimited file upload',
      'Unlimited AI Detectable',
      'Unlimited Humanize Essay',
      'Unlimited Essays Generator',
      'Unlimited Flashcards Generator',
      'Unlimited Study Guides Generator',
    ],
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
  'English',
  'Spanish',
  'French',
  'German',
  'Mandarin',
  'Hindi',
  'Portuguese',
  'Russian',
  'Japanese',
  'Korean',
  'Arabic',
  'Italian',
  'Dutch',
  'Swedish',
  'Turkish',
  'Persian',
  'Polish',
  'Danish',
  'Norwegian',
  'Finnish',
  'Greek',
  'Hebrew',
  'Thai',
  'Indonesian',
  'Vietnamese',
];

export const wordCounts = [
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '1000',
  '1100',
  '1200',
  '1300',
  '1400',
  '1500',
  '1600',
  '1700',
  '1800',
  '1900',
  '2000',
];
export const features: IFeature[] = [
  {
    id: 1,
    title: 'Create Your Project',
    description:
      'Project helps organize your study materials and build a study plan.',
    image: '/images/how-it-works/create_project.png',
  },
  {
    id: 2,
    title: 'Drop All Files',
    description:
      'Drop all your study materials into the project and let the AI learn them for you.',
    image: '/images/how-it-works/drop_files.png',
  },
  {
    id: 3,
    title: 'Study With AI',
    description:
      'All your study tools in one place. AI Chat, Flash Cards, Study Guides, Essays Generator and more.',
    image: '/images/how-it-works/study_tools.png',
  },
];

export const featureDetails = [
  {
    id: 1,
    title: 'Flash Card Usage 🔖',
    description: `Turn your notes into smart, easy-to-review flashcards.
Studies show flashcards can improve scores by up to 50%.`,
    image: '/images/features-details/flashcard.jpeg',
    // element: <FlashCardDemo />,
  },
  {
    id: 2,
    title: 'Chat in your own language 🌎',
    description: `Learning shouldn’t be limited by language.
Talk to your PDFs and get support in the language you're most comfortable with.`,
    image: '/images/features-details/multi-language.jpeg',
  },
  {
    id: 3,
    title: 'Smart Study Guides 📝',
    description: `Turn lengthy files into clear, structured summaries with key concepts, definitions, and must-know points automatically.`,
    image: '/images/features-details/multi-language.jpeg',
  },
];

export const gainList = [
  {
    icon: ClockArrowDownIcon,
    title: 'Save Time And Effort',
    description:
      'Skip the hassle of sifting through lengthy PDFs. Get instant answers and summaries to focus on what truly matters—understanding the material.',
  },
  {
    icon: BookCopyIcon,
    title: 'Ace Your Homework Faster',
    description:
      'Breeze through assignments with AI-powered tools that deliver high-quality results in a fraction of the time.',
  },
  {
    icon: NotebookIcon,
    title: 'Turn Notes Into Flashcards',
    description:
      'Generate smart, customizable flashcards from your PDFs with a single click. Study more effectively with tools tailored to your needs.',
  },
  {
    icon: NotebookPenIcon,
    title: 'Stay Organized & Prepared',
    description:
      'Simplify your study process by turning overwhelming PDF files into digestible insights and structured learning aids.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Boost Retention and Grades',
    description:
      'With quick answers and personalized flashcards, you’ll retain information better and perform with confidence in class or exams.',
  },
  {
    icon: GraduationCapIcon,
    title: 'Study Anywhere, Anytime',
    description:
      'Access your notes, PDFs, and flashcards on the go. Your study tools are now as mobile as you are.',
  },
  {
    icon: ArrowUpWideNarrowIcon,
    title: 'Enhance Productivity',
    description:
      'Transform tedious study sessions into efficient, focused learning experiences that leave you more time for what you love.',
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
    link: 'https://www.instagram.com/info.learnpdf',
  },
  {
    icon: TwitterIcon,
    title: 'Twiter',
    link: 'https://x.com/learnwithphuc',
  },
  // {
  //   icon: FacebookIcon,
  //   title: 'Facebook',
  //   link: 'https://www.facebook.com/PhucMai',
  // },
];

export const greyBackground = 'bg-[#f1f1f1]';

export const daysOfTrial = 3;
export const trialProjects = 3;

export const flashCardWidthResponsive = `
  2xl:w-[1200px] xl:w-[900px] lg:w-[700px] md:w-[500px] sm:w-[300px] w-[250px] h-[500px] md:h-[600px]
`;
export const flashCardTextResponsive = `
text-lg sm:text-xl md:text-2xl lg:text-3xl
`;
