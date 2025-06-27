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
    default: 'LearnPDF',
    template: '%s - LearnPDF',
  },
  description: 'Help students learn faster, less stress, and more fun.',
  icons: {
    icon: '/images/logo.png?v=2',
  },
  twitter: {
    card: 'summary_large_image',
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
