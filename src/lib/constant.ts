import { BookCopyIcon, CircleHelpIcon, MessageCircleMoreIcon } from "lucide-react";

export const tabs = [
    {
        name: 'Chats',
        icon: MessageCircleMoreIcon,
        link: '/chats'
    },
    {
        name: 'Flash Cards',
        icon: BookCopyIcon,
        link: '/flash-cards'
    },
    {
        name: 'Help',
        icon: CircleHelpIcon,
        link: '/help'
    }
]

export const pricingTabs = [
    {
        title: 'Monthly',
        price: 9.99,
        plan: 'month',
    },
    {
        title: 'Annually',
        price: 99.99,
        plan: 'year',
        isPopular: true
    }
]