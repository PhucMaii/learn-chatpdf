import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Providers from '@/components/Providers';
import { Toaster } from 'react-hot-toast';
import { domAnimation, LazyMotion } from 'framer-motion';

// const geistSans = localFont({
//   src: './fonts/Inter-Regular.ttf',
//   variable: '--font-geist-sans',
//   weight: '100 900',
// });

const teachers = localFont({
  src: [
    {
      path: './fonts/Teachers-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Teachers-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Teachers-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/Teachers-Bold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/Teachers-ExtraBold.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: 'LearnPDF - AI-Powered Learning Platform',
    template: '%s | LearnPDF',
  },
  description: 'Transform your PDFs into interactive learning materials with AI. Auto-generate flashcards, quizzes, essays, and study guides. Start learning smarter today.',
  keywords: [
    'AI learning platform',
    'PDF to flashcards',
    'auto generate quizzes',
    'study guide generator',
    'LearnPDF',
    'educational technology',
    'smart study tools',
  ],
  authors: [{ name: 'LearnPDF Team' }],
  creator: 'LearnPDF',
  metadataBase: new URL('https://learnpdf.ca'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'LearnPDF - AI-Powered Learning Platform',
    description: 'Transform your PDFs into interactive learning materials with AI. Auto-generate flashcards, quizzes, essays, and study guides.',
    url: 'https://learnpdf.ca',
    siteName: 'LearnPDF',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LearnPDF - AI-Powered Learning Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LearnPDF - AI-Powered Learning Platform',
    description: 'Transform your PDFs into interactive learning materials with AI. Auto-generate flashcards, quizzes, essays, and study guides.',
    images: ['/twitter-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <Providers>
        <LazyMotion features={domAnimation} strict>
          <html lang="en">
            <head>
              <link rel="preload" href="/images/learning.png" as="image" />
              <link rel="preload" href="/images/logo.png" as="image" />
            </head>
            <body className={`${teachers.className} antialiased`}>
              {children}
            </body>
            <Toaster />
          </html>
        </LazyMotion>
      </Providers>
    </ClerkProvider>
  );
}
