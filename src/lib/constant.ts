import {
  BookCopyIcon,
  CircleHelpIcon,
  MessageCircleMoreIcon,
} from 'lucide-react';

export const tabs = [
  {
    name: 'Chats',
    icon: MessageCircleMoreIcon,
    link: '/chats',
    params: 'chats',
  },
  {
    name: 'Flash Cards',
    icon: BookCopyIcon,
    link: '/flash-cards',
    params: 'flash-cards',
  },
  {
    name: 'Help',
    icon: CircleHelpIcon,
    link: '/help',
    params: 'help',
  },
];

export const pricingTabs = [
  {
    title: 'Weekly',
    price: 5.99,
    plan: 'week',
  },
  {
    title: 'Annually',
    price: 79.99,
    plan: 'year',
    isPopular: true,
    save: ['Save 75% vs weekly', 'Save 33% vs monthly'],
  },
  {
    title: 'Monthly',
    price: 9.99,
    plan: 'month',
    save: ['Save 60% vs weekly'],
  },
];

export const MAX_FILE_UPLOAD_IN_TRIAL = 2;


export const flashCardResults = [
  {
    text: 'Congratulations, you have aced all the flash cards!',
    percentage: 100,
    icon: '🎉'
  },
  {
    text: 'Almost there! Just a few more to go!',
    percentage: 80,
    icon: '🚀'
  },
  {
    text: 'Not bad! Lets try again to get some more practice!',
    percentage: 50,
    icon: '💪'
  },
  {
    text: 'Not quite there yet, but you can do it better!',
    percentage: 20,
    icon: '✊'
  },
  {
    text: 'I know you can do it! Keep up the good work!',
    percentage: 0,
    icon: '👍'
  },
]