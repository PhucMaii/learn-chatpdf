import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | LearnPDF - User Agreement & Terms',
  description: 'LearnPDF Terms of Service - Read our user agreement, terms of use, and service conditions for our AI-powered learning platform.',
  keywords: [
    'terms of service',
    'user agreement',
    'LearnPDF terms',
    'service conditions',
    'user terms',
    'legal terms',
    'platform agreement',
    'terms of use',
  ],
  authors: [{ name: 'LearnPDF Team' }],
  creator: 'LearnPDF',
  metadataBase: new URL('https://learnpdf.ca'),
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms of Service | LearnPDF - User Agreement & Terms',
    description: 'Read LearnPDF\'s Terms of Service and user agreement for our AI-powered learning platform.',
    url: 'https://learnpdf.ca/terms',
    siteName: 'LearnPDF',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LearnPDF Terms of Service',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | LearnPDF',
    description: 'Read LearnPDF\'s Terms of Service and user agreement.',
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

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <p className="text-lg text-gray-600 mb-8">
          <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using LearnPDF (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              LearnPDF is an AI-powered learning platform that provides the following services:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>AI-powered conversion of documents into interactive learning materials</li>
              <li>Automatic generation of flashcards, quizzes, and study guides</li>
              <li>Essay writing assistance and content generation</li>
              <li>Learning progress tracking and analytics</li>
              <li>File upload and processing capabilities</li>
              <li>Chat functionality with AI for educational support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts and Registration</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To access certain features of the Service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Upload or share content that is illegal, harmful, or violates any laws</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Upload malicious software, viruses, or harmful code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the Service for commercial purposes without permission</li>
              <li>Share your account credentials with others</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Use automated systems to access the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Content and Intellectual Property</h2>
            
            <h3 className="text-xl font-medium text-gray-900 mb-3">5.1 Your Content</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You retain ownership of content you upload to the Service. By uploading content, you grant us a limited license to process, store, and use your content to provide the Service.
            </p>

            <h3 className="text-xl font-medium text-gray-900 mb-3">5.2 Generated Content</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Content generated by our AI systems (flashcards, quizzes, essays, etc.) is provided for your educational use. You may use this content for personal study purposes.
            </p>

            <h3 className="text-xl font-medium text-gray-900 mb-3">5.3 Our Content</h3>
            <p className="text-gray-700 leading-relaxed">
              The Service, including its design, functionality, and content, is owned by LearnPDF and protected by intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Subscription and Payment</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Some features of the Service require a paid subscription. By subscribing, you agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Pay all applicable fees as described on the pricing page</li>
              <li>Provide accurate billing information</li>
              <li>Authorize us to charge your payment method</li>
              <li>Understand that fees are non-refundable except as required by law</li>
              <li>Accept that subscription fees may change with notice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
            <p className="text-gray-700 leading-relaxed">
              Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Service Availability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We strive to maintain high service availability but cannot guarantee uninterrupted access. The Service may be temporarily unavailable due to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Scheduled maintenance and updates</li>
              <li>Technical difficulties or system failures</li>
              <li>Force majeure events beyond our control</li>
              <li>Third-party service disruptions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              To the maximum extent permitted by law, LearnPDF shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Disclaimers</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind. We disclaim all warranties, express or implied, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Warranties of merchantability and fitness for a particular purpose</li>
              <li>Warranties regarding accuracy, reliability, or completeness of content</li>
              <li>Warranties that the Service will be uninterrupted or error-free</li>
              <li>Warranties regarding the security of the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may terminate or suspend your account and access to the Service at any time, with or without notice, for any reason, including violation of these Terms.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You may terminate your account at any time by contacting us or using the account deletion feature in your settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on our website. Your continued use of the Service after such changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700">
                <strong>Email:</strong> maithienphuc0102@gmail.com<br />
                <strong>Website:</strong> https://learnpdf.ca
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
