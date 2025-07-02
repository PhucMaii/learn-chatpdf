import NavBar from '@/components/NavBar';
import Introduction from '@/components/Landing/Introduction';
import Features from '@/components/Landing/Features';
import FeatureDetails from '@/components/Landing/FeatureDetails';
import Gain from '@/components/Landing/Gain';
import Footer from '@/components/Landing/Footer';
import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: "LearnPDF - AI-Powered Learning Platform | Auto-Generate Flashcards, Quizzes & Essays",
  description: "Transform your PDFs into interactive learning materials with AI. Auto-generate flashcards, quizzes, essays, and study guides. Track progress, boost retention, and accelerate learning with our intelligent study platform.",
  keywords: [
    "AI learning platform",
    "PDF to flashcards",
    "auto generate quizzes",
    "study guide generator",
    "essay generator",
    "learning analytics",
    "educational technology",
    "smart study tools",
    "academic performance tracking",
    "interactive learning",
    "AI-powered education",
    "digital learning platform",
    "study materials generator",
    "quiz creation tool",
    "flashcard maker",
    "essay writing assistant",
    "learning progress tracker",
    "educational AI",
    "study optimization",
    "knowledge retention",
    "learnpdf",
    "learnpdf.ca",
    "youtube to pdf",
    "youtube to flashcards",
    "youtube to quizzes",
    "youtube to essays",
    "youtube to study guides",
    "youtube to study materials",
    "youtube to study notes",
  ],
  authors: [{ name: "LearnPDF Team" }],
  creator: "LearnPDF",
  publisher: "LearnPDF",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://learnpdf.ca'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "LearnPDF - AI-Powered Learning Platform | Auto-Generate Flashcards, Quizzes & Essays",
    description: "Transform your PDFs into interactive learning materials with AI. Auto-generate flashcards, quizzes, essays, and study guides. Track progress, boost retention, and accelerate learning.",
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
    title: "LearnPDF - AI-Powered Learning Platform",
    description: "Transform your PDFs into interactive learning materials with AI. Auto-generate flashcards, quizzes, essays, and study guides.",
    images: ['/twitter-image.png'],
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
  verification: {
    google: '3bACgvbLFAm6mep-OeD3eMNgBOHGF3_0s7o7gQmjyBE',
  },
  category: 'education',
  classification: 'Educational Technology',
  other: {
    'application-name': 'LearnPDF',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'LearnPDF',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'msapplication-config': '/browserconfig.xml',
    'msapplication-TileColor': '#3B82F6',
    'msapplication-tap-highlight': 'no',
    'theme-color': '#3B82F6',
  },
};

export default async function Home() {
  // const { userId } = await auth();
  // let firstChat;

  // if (userId) {
  //   firstChat = await db.select().from(chats).where(eq(chats.userId, userId));

  //   if (firstChat) {
  //     firstChat = firstChat[0];
  //   }
  // }

  return (
    <>
      {/* Structured Data Schema */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "LearnPDF",
            "description": "AI-powered learning platform that transforms PDFs into interactive study materials including flashcards, quizzes, essays, and study guides.",
            "url": "https://learnpdf.ca",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free tier available with premium features"
            },
            "featureList": [
              "AI-powered PDF to flashcards conversion",
              "Auto-generate quizzes from study materials",
              "Essay generation and writing assistance",
              "Study guide creation",
              "Learning progress tracking",
              "Performance analytics",
              "Interactive learning tools",
              "Knowledge retention optimization"
            ],
            "author": {
              "@type": "Organization",
              "name": "LearnPDF Team"
            },
            "publisher": {
              "@type": "Organization",
              "name": "LearnPDF",
              "url": "https://learnpdf.ca"
            },
            "funder": {
              "@type": "Organization",
              "name": "LearnPDF"
            },
            "audience": {
              "@type": "Audience",
              "audienceType": "Students, Educators, Professionals"
            },
            "educationalUse": [
              "Study aid",
              "Test preparation",
              "Knowledge assessment",
              "Learning reinforcement",
              "Academic writing"
            ],
            "learningResourceType": [
              "Interactive multimedia",
              "Assessment tool",
              "Study guide",
              "Flashcard system",
              "Quiz platform"
            ],
            "interactivityType": "active",
            "educationalAlignment": {
              "@type": "AlignmentObject",
              "alignmentType": "teaches",
              "educationalFramework": "General Education"
            }
          })
        }}
      />

      <div className="max-w-[1400px] mx-auto min-h-screen flex justify-center">
        <div className="py-4 md:py-8 px-4 md:px-8 flex flex-col gap-8 md:gap-16 w-full m-0 overflow-x-hidden overflow-y-scroll">
          {/* Navigation */}
          <NavBar />
          
          {/* Hero Section */}
          <Introduction />
          
          {/* Core Features */}
          <Features />
          
          {/* Detailed Feature Breakdown */}
          <FeatureDetails />
          
          {/* Benefits & Value Proposition */}
          <Gain />
          
          {/* Call to Action */}
          {/* <div className="w-full p-8 md:p-16">
            <InvitationCard />
          </div> */}
          
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </>
  );
}
