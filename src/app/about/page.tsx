import { Metadata } from 'next';
import Script from 'next/script';
import { 
  Brain, 
  Target, 
  Users, 
  Award, 
  Lightbulb, 
  Heart,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | LearnPDF - AI-Powered Learning Platform',
  description: 'Learn about LearnPDF\'s mission to revolutionize education with AI. Discover our story, team, and commitment to making learning accessible, efficient, and engaging for students worldwide.',
  keywords: [
    'about LearnPDF',
    'AI education company',
    'educational technology',
    'learning platform team',
    'AI-powered learning mission',
    'educational innovation',
    'student success',
    'LearnPDF story',
  ],
  authors: [{ name: 'LearnPDF Team' }],
  creator: 'LearnPDF',
  metadataBase: new URL('https://learnpdf.ca'),
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Us | LearnPDF - AI-Powered Learning Platform',
    description: 'Learn about LearnPDF\'s mission to revolutionize education with AI. Discover our story and commitment to student success.',
    url: 'https://learnpdf.ca/about',
    siteName: 'LearnPDF',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LearnPDF About Us',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | LearnPDF',
    description: 'Learn about LearnPDF\'s mission to revolutionize education with AI-powered learning tools.',
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
};

export default function AboutPage() {
  return (
    <>
      {/* Structured Data for About Page */}
      <Script
        id="about-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About LearnPDF",
            "description": "Learn about LearnPDF's mission to revolutionize education with AI-powered learning tools",
            "url": "https://learnpdf.ca/about",
            "mainEntity": {
              "@type": "Organization",
              "name": "LearnPDF",
              "url": "https://learnpdf.ca",
              "description": "AI-powered learning platform that transforms study materials into interactive learning experiences",
              "foundingDate": "2024",
              "mission": "To revolutionize education by making learning more accessible, efficient, and engaging through AI technology",
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "maithienphuc0102@gmail.com",
                "contactType": "customer service"
              }
            }
          })
        }}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-emerald-600">LearnPDF</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We&apos;re on a mission to revolutionize education by making learning more accessible, 
            efficient, and engaging through the power of artificial intelligence.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            To democratize education by providing students with AI-powered tools that transform 
            traditional study materials into interactive, personalized learning experiences. 
            We believe every student deserves access to technology that makes learning more 
            effective and less stressful.
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">The Problem We Saw</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Students worldwide struggle with overwhelming amounts of study materials, 
                inefficient study methods, and the stress of academic pressure. Traditional 
                learning approaches often lead to poor retention and burnout.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We recognized that AI technology could solve these challenges by creating 
                personalized, interactive learning experiences that adapt to each student&apos;s needs.
              </p>
            </div>
            <div className="bg-gray-100 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <Lightbulb className="w-8 h-8 text-yellow-500" />
                <h4 className="text-lg font-semibold">The Solution</h4>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-gray-700">AI-powered content analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-gray-700">Automated study material generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-gray-700">Personalized learning paths</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-gray-700">Progress tracking and analytics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously push the boundaries of what&apos;s possible in educational technology, 
                always seeking new ways to enhance the learning experience.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Accessibility</h3>
              <p className="text-gray-600">
                We believe quality education should be accessible to everyone, regardless of 
                background, location, or financial situation.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Student Success</h3>
              <p className="text-gray-600">
                Every decision we make is guided by one question: &quot;Will this help students 
                learn better and achieve their goals?&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Impact Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">199+</div>
              <div className="text-gray-700 font-medium">Students Helped</div>
              <div className="text-sm text-gray-500">And growing every day</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">300%</div>
              <div className="text-gray-700 font-medium">Improved Retention</div>
              <div className="text-sm text-gray-500">Average improvement in learning</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">80%</div>
              <div className="text-gray-700 font-medium">Time Saved</div>
              <div className="text-sm text-gray-500">On study material creation</div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Meet Our Team</h2>
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Award className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">LearnPDF Team</h3>
              <p className="text-gray-600 mb-4">
                A passionate group of educators, developers, and AI researchers dedicated to 
                transforming how students learn and succeed.
              </p>
              <p className="text-gray-500">
                We combine deep expertise in education, artificial intelligence, and user experience 
                to create tools that truly make a difference in students&apos; lives.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-xl mb-6 opacity-90">
            Ready to transform your learning experience? Start your journey with LearnPDF today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/sign-up" 
              className="bg-white text-emerald-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
