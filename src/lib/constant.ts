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
  },
  {
    name: 'Flash Cards',
    icon: BookCopyIcon,
    link: '/flash-cards',
  },
  {
    name: 'Help',
    icon: CircleHelpIcon,
    link: '/help',
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
