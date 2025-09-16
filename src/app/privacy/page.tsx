import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | LearnPDF - Data Protection & Privacy',
  description: 'LearnPDF Privacy Policy - Learn how we protect your data, handle personal information, and ensure your privacy while using our AI-powered learning platform.',
  keywords: [
    'privacy policy',
    'data protection',
    'LearnPDF privacy',
    'user data security',
    'GDPR compliance',
    'privacy rights',
    'data handling',
    'personal information',
  ],
  authors: [{ name: 'LearnPDF Team' }],
  creator: 'LearnPDF',
  metadataBase: new URL('https://learnpdf.ca'),
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | LearnPDF - Data Protection & Privacy',
    description: 'Learn how LearnPDF protects your data and ensures your privacy while using our AI-powered learning platform.',
    url: 'https://learnpdf.ca/privacy',
    siteName: 'LearnPDF',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LearnPDF Privacy Policy',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | LearnPDF',
    description: 'Learn how LearnPDF protects your data and ensures your privacy.',
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

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <p className="text-lg text-gray-600 mb-8">
          <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to LearnPDF (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered learning platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-gray-900 mb-3">2.1 Personal Information</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Name and email address (when you create an account)</li>
              <li>Profile information and preferences</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Communication data (when you contact us)</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 mb-3 mt-6">2.2 Usage Information</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Files you upload (PDFs, documents, images)</li>
              <li>Study materials generated (flashcards, quizzes, essays)</li>
              <li>Learning progress and performance data</li>
              <li>Platform usage patterns and interactions</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 mb-3 mt-6">2.3 Technical Information</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide and improve our AI-powered learning services</li>
              <li>Generate personalized study materials (flashcards, quizzes, essays)</li>
              <li>Track your learning progress and provide analytics</li>
              <li>Process payments and manage your subscription</li>
              <li>Communicate with you about your account and our services</li>
              <li>Provide customer support</li>
              <li>Ensure platform security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. AI Processing and Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your uploaded files and generated content are processed by our AI systems to create personalized learning materials. We implement the following security measures:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>End-to-end encryption for file uploads and storage</li>
              <li>Secure AI processing with data anonymization</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication protocols</li>
              <li>Data backup and recovery systems</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Information Sharing and Disclosure</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We do not sell, trade, or rent your personal information. We may share your information only in the following circumstances:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations or court orders</li>
              <li>To protect our rights, property, or safety</li>
              <li>With trusted service providers who assist in our operations (under strict confidentiality agreements)</li>
              <li>In connection with a business transfer or acquisition</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. You may request deletion of your account and associated data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights and Choices</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Restriction:</strong> Limit how we process your information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Children&apos;s Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. Your continued use of our services after such changes constitutes acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700">
                <strong>Email:</strong> maithienphuc0102@gmail.com<br />
                <strong>Website:</strong> https://learnpdf.ca<br />
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
