"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Download,
  Mail,
  Phone,
  User,
  FileText,
  Search,
  DollarSign,
  Key,
  ClipboardCheck,
  Building,
  Shield,
  Calculator,
  Users,
} from "lucide-react";

const buyingSteps = [
  {
    number: "01",
    title: "Assess Your Financial Readiness",
    icon: Calculator,
    description:
      "Before starting your home search, evaluate your finances to understand what you can afford.",
    tips: [
      "Check your credit score (aim for 620+ for conventional loans)",
      "Calculate your debt-to-income ratio (ideally under 43%)",
      "Save for down payment (3-20% depending on loan type)",
      "Budget for closing costs (2-5% of purchase price)",
      "Build an emergency fund for unexpected expenses",
    ],
  },
  {
    number: "02",
    title: "Get Pre-Approved for a Mortgage",
    icon: FileText,
    description:
      "A pre-approval letter shows sellers you're a serious buyer and helps you understand your budget.",
    tips: [
      "Gather required documents (pay stubs, tax returns, bank statements)",
      "Compare rates from multiple lenders",
      "Understand different loan types (FHA, VA, Conventional)",
      "Lock in your rate when you find a good one",
      "Keep your pre-approval letter handy for offers",
    ],
  },
  {
    number: "03",
    title: "Define Your Needs & Wants",
    icon: ClipboardCheck,
    description:
      "Create a clear picture of your ideal home to focus your search and save time.",
    tips: [
      "List must-haves vs. nice-to-haves",
      "Consider location, commute, and schools",
      "Think about future needs (growing family, working from home)",
      "Research neighborhoods and crime rates",
      "Decide on home type (single-family, condo, townhome)",
    ],
  },
  {
    number: "04",
    title: "Start Your Home Search",
    icon: Search,
    description:
      "Work with a real estate agent to find homes that match your criteria and budget.",
    tips: [
      "Partner with an experienced local agent",
      "Set up property alerts for new listings",
      "Attend open houses to get a feel for the market",
      "Take notes and photos during showings",
      "Don't rush - the right home is worth waiting for",
    ],
  },
  {
    number: "05",
    title: "Make an Offer",
    icon: DollarSign,
    description:
      "When you find the right home, work with your agent to craft a competitive offer.",
    tips: [
      "Research comparable sales in the area",
      "Consider market conditions (buyer's vs. seller's market)",
      "Include appropriate contingencies",
      "Be prepared to negotiate",
      "Have earnest money ready (1-3% of purchase price)",
    ],
  },
  {
    number: "06",
    title: "Complete Due Diligence",
    icon: Shield,
    description:
      "Protect your investment by thoroughly inspecting and evaluating the property.",
    tips: [
      "Schedule a professional home inspection",
      "Review HOA documents if applicable",
      "Get a property appraisal",
      "Order title search and insurance",
      "Review seller disclosures carefully",
    ],
  },
  {
    number: "07",
    title: "Close on Your New Home",
    icon: Key,
    description:
      "The final step! Complete paperwork, transfer funds, and get your keys.",
    tips: [
      "Do a final walkthrough 24-48 hours before closing",
      "Review all closing documents carefully",
      "Bring required documents and funds to closing",
      "Set up utilities and change your address",
      "Celebrate - you're a homeowner!",
    ],
  },
];

const faqs = [
  {
    question: "How much should I save for a down payment?",
    answer:
      "The traditional recommendation is 20% to avoid PMI, but many loan programs allow as little as 3-3.5% down. FHA loans require 3.5%, VA loans may require 0%, and conventional loans start at 3%.",
  },
  {
    question: "What credit score do I need to buy a house?",
    answer:
      "Most conventional loans require a minimum credit score of 620. FHA loans may accept scores as low as 580 (or 500 with 10% down). The higher your score, the better interest rates you'll qualify for.",
  },
  {
    question: "How long does the home buying process take?",
    answer:
      "On average, the process takes 30-60 days from offer acceptance to closing. However, it can take longer depending on inspections, appraisals, and lender processing times.",
  },
  {
    question: "What are closing costs?",
    answer:
      "Closing costs typically range from 2-5% of the purchase price and include lender fees, title insurance, appraisal fees, attorney fees, and prepaid items like property taxes and homeowner's insurance.",
  },
];

export default function BuyingGuidePage() {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...leadForm,
          source: "buying_guide",
          notes: "Downloaded First-Time Buyer's Guide PDF",
        }),
      });
    } catch (error) {
      console.error("Error saving lead:", error);
    }

    setIsSubmitting(false);
    setLeadSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            href="/"
            className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold">First-Time Buyer&apos;s Guide</h1>
          </div>
          <p className="text-xl text-blue-100 max-w-2xl mb-8">
            Everything you need to know about buying your first home. From
            pre-approval to closing, we&apos;ll guide you every step of the way.
          </p>
          <button
            onClick={() => setShowLeadForm(true)}
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Free PDF Guide
          </button>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            7 Steps to Buying Your Home
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Follow this comprehensive guide to navigate the home buying process
            with confidence.
          </p>
        </div>

        <div className="space-y-8">
          {buyingSteps.map((step, index) => (
            <div
              key={step.number}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-white">
                  <div className="text-6xl font-bold text-white/20 mb-4">
                    {step.number}
                  </div>
                  <step.icon className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-blue-100">{step.description}</p>
                </div>
                <div className="md:w-2/3 p-8">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Key Tips:
                  </h4>
                  <ul className="space-y-3">
                    {step.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">
                    {faq.question}
                  </span>
                  <ArrowRight
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedFaq === index ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4 text-gray-600">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Home Search?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Our experienced agents are here to guide you through every step of
            the buying process. Get personalized help today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/listings"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Search className="w-5 h-5" />
              Browse Listings
            </Link>
            <Link
              href="/resources/mortgage-calculator"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Calculator className="w-5 h-5" />
              Calculate Payment
            </Link>
          </div>
        </div>
      </div>

      {/* Lead Capture Modal */}
      {showLeadForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            {!leadSubmitted ? (
              <>
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  Get Your Free Guide
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                  Enter your details to download our comprehensive First-Time
                  Buyer&apos;s Guide PDF.
                </p>

                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={leadForm.name}
                        onChange={(e) =>
                          setLeadForm({ ...leadForm, name: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John Smith"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={leadForm.email}
                        onChange={(e) =>
                          setLeadForm({ ...leadForm, email: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="john@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone (optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={leadForm.phone}
                        onChange={(e) =>
                          setLeadForm({ ...leadForm, phone: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      "Processing..."
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Download Free Guide
                      </>
                    )}
                  </button>
                </form>

                <button
                  onClick={() => setShowLeadForm(false)}
                  className="w-full mt-4 text-gray-500 hover:text-gray-700 text-sm"
                >
                  Maybe later
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Check Your Email!
                </h2>
                <p className="text-gray-600 mb-6">
                  We&apos;ve sent your First-Time Buyer&apos;s Guide to your inbox.
                  Happy house hunting!
                </p>
                <button
                  onClick={() => {
                    setShowLeadForm(false);
                    setLeadSubmitted(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
