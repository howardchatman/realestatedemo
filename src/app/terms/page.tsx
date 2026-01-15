"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: January 15, 2026</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing or using the Chatman Real Estate website and services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Services Description</h2>
              <p className="text-gray-600 mb-4">
                Chatman Real Estate provides real estate brokerage services, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Property listings and search functionality</li>
                <li>AI-powered virtual assistant (AIVA) for 24/7 support</li>
                <li>Home valuation estimates</li>
                <li>Connection with licensed real estate agents</li>
                <li>Transaction support and guidance</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
              <p className="text-gray-600 mb-4">By using our services, you agree to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Use our services only for lawful purposes</li>
                <li>Not interfere with or disrupt our services</li>
                <li>Not attempt to gain unauthorized access to any systems</li>
                <li>Not use automated systems to access our website without permission</li>
                <li>Respect the intellectual property rights of others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Property Listings</h2>
              <p className="text-gray-600 mb-4">
                While we strive to provide accurate listing information:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>We do not guarantee the accuracy of listing details, prices, or availability</li>
                <li>Properties may be sold, removed, or modified without notice</li>
                <li>Photos and descriptions are provided for informational purposes only</li>
                <li>You should verify all information independently before making decisions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. AI Assistant (AIVA)</h2>
              <p className="text-gray-600 mb-4">
                Our AI assistant AIVA is designed to help with general inquiries. Please note:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>AIVA provides general information and is not a substitute for professional advice</li>
                <li>AIVA cannot execute legally binding agreements on your behalf</li>
                <li>Information provided by AIVA should be verified with a licensed agent</li>
                <li>We are not liable for decisions made based on AIVA&apos;s responses</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Home Valuations</h2>
              <p className="text-gray-600 mb-4">
                Our home valuation tool provides estimates based on available data:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Valuations are estimates and not appraisals</li>
                <li>Actual home values may differ significantly</li>
                <li>We recommend obtaining a professional appraisal for important decisions</li>
                <li>We are not responsible for actions taken based on valuation estimates</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
              <p className="text-gray-600 mb-4">
                All content on this website, including text, graphics, logos, and software, is the property of Chatman Real Estate or its licensors and is protected by copyright and trademark laws. You may not reproduce, distribute, or create derivative works without our express written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                To the fullest extent permitted by law:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>We are not liable for any indirect, incidental, or consequential damages</li>
                <li>Our liability shall not exceed the amount you paid us for services</li>
                <li>We are not responsible for third-party content or services</li>
                <li>We do not guarantee uninterrupted or error-free service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Indemnification</h2>
              <p className="text-gray-600 mb-4">
                You agree to indemnify and hold harmless Chatman Real Estate, its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of our services or violation of these terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Dispute Resolution</h2>
              <p className="text-gray-600 mb-4">
                Any disputes arising from these terms or our services shall be resolved through:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Good faith negotiation between the parties</li>
                <li>Mediation if negotiation fails</li>
                <li>Binding arbitration as a last resort</li>
              </ul>
              <p className="text-gray-600 mt-4">
                These terms shall be governed by the laws of the State of California.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to suspend or terminate your access to our services at any time, without notice, for conduct that we believe violates these terms or is harmful to other users, us, or third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                We may revise these terms at any time by updating this page. Your continued use of our services after changes are posted constitutes acceptance of the updated terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-600">
                  <strong>Chatman Real Estate</strong><br />
                  123 Main Street, Suite 100<br />
                  Oakwood, CA 90210<br />
                  Email: legal@chatmanrealestate.com<br />
                  Phone: (832) 770-7998
                </p>
              </div>
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
