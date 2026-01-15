"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: January 15, 2026</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-4">
                At Chatman Real Estate (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
              <p className="text-gray-600 mb-4">We may collect the following types of information:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Personal Information:</strong> Name, email address, phone number, and mailing address when you fill out forms or contact us.</li>
                <li><strong>Property Preferences:</strong> Information about your real estate needs, including budget, location preferences, and property requirements.</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our website, including pages visited, time spent, and actions taken.</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers.</li>
                <li><strong>Communication Data:</strong> Records of conversations with our AI assistant (AIVA) and human agents.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Provide and improve our real estate services</li>
                <li>Match you with suitable properties based on your preferences</li>
                <li>Communicate with you about listings, appointments, and updates</li>
                <li>Process transactions and send related information</li>
                <li>Personalize your experience on our website</li>
                <li>Analyze usage patterns to improve our services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. AI Assistant (AIVA)</h2>
              <p className="text-gray-600 mb-4">
                Our AI assistant, AIVA, is designed to help you with real estate inquiries 24/7. When you interact with AIVA:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Your conversations may be recorded and analyzed to improve service quality</li>
                <li>Information you provide may be used to personalize property recommendations</li>
                <li>Conversations may be reviewed by human agents for quality assurance</li>
                <li>You can request deletion of conversation history by contacting us</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Information Sharing</h2>
              <p className="text-gray-600 mb-4">We may share your information with:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Service Providers:</strong> Third parties who help us operate our business (e.g., hosting providers, analytics services)</li>
                <li><strong>Business Partners:</strong> Mortgage lenders, title companies, and other real estate professionals when relevant to your transaction</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              </ul>
              <p className="text-gray-600 mt-4">
                We do not sell your personal information to third parties for marketing purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
              <p className="text-gray-600 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of your data in a portable format</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies</h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
              </p>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-600">
                  <strong>Chatman Real Estate</strong><br />
                  123 Main Street, Suite 100<br />
                  Oakwood, CA 90210<br />
                  Email: privacy@chatmanrealestate.com<br />
                  Phone: (832) 770-7998
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
