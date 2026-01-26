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
  DollarSign,
  Camera,
  Paintbrush,
  Calendar,
  TrendingUp,
  FileText,
  Key,
  Target,
  Sparkles,
} from "lucide-react";

const sellingSteps = [
  {
    number: "01",
    title: "Prepare Your Home for Sale",
    icon: Paintbrush,
    description:
      "First impressions matter. Get your home ready to wow potential buyers.",
    tips: [
      "Declutter and depersonalize each room",
      "Deep clean everything, including carpets and windows",
      "Make minor repairs (leaky faucets, loose handles, etc.)",
      "Consider a fresh coat of neutral paint",
      "Boost curb appeal with landscaping and a clean entrance",
    ],
  },
  {
    number: "02",
    title: "Price It Right",
    icon: Target,
    description:
      "Setting the right price is crucial for attracting buyers and maximizing your return.",
    tips: [
      "Get a Comparative Market Analysis (CMA) from an agent",
      "Research recent sales of similar homes in your area",
      "Consider current market conditions",
      "Price competitively to generate interest",
      "Avoid overpricing - it can lead to longer time on market",
    ],
  },
  {
    number: "03",
    title: "Stage Your Home",
    icon: Sparkles,
    description:
      "Professional staging helps buyers envision themselves living in your home.",
    tips: [
      "Arrange furniture to maximize space and flow",
      "Add fresh flowers or plants for color",
      "Ensure good lighting in every room",
      "Create inviting outdoor spaces",
      "Consider professional staging for best results",
    ],
  },
  {
    number: "04",
    title: "Market Your Property",
    icon: Camera,
    description:
      "Get maximum exposure with professional marketing and photography.",
    tips: [
      "Hire a professional photographer",
      "Create a virtual tour or 3D walkthrough",
      "List on MLS and major real estate websites",
      "Use social media marketing",
      "Host open houses and private showings",
    ],
  },
  {
    number: "05",
    title: "Review Offers & Negotiate",
    icon: FileText,
    description:
      "Evaluate offers carefully and negotiate terms that work for you.",
    tips: [
      "Review offer price, contingencies, and timeline",
      "Consider buyer's financing and pre-approval strength",
      "Negotiate repairs, closing costs, and terms",
      "Counter-offer strategically",
      "Consider backup offers for security",
    ],
  },
  {
    number: "06",
    title: "Navigate the Closing Process",
    icon: Calendar,
    description:
      "Work through inspections, appraisals, and paperwork to close the sale.",
    tips: [
      "Accommodate home inspection and appraisal",
      "Respond to repair requests reasonably",
      "Review and sign closing documents",
      "Arrange for final walkthrough",
      "Transfer utilities and cancel services",
    ],
  },
  {
    number: "07",
    title: "Close & Celebrate",
    icon: Key,
    description:
      "Hand over the keys and complete your successful home sale!",
    tips: [
      "Sign final paperwork at closing",
      "Receive your proceeds (wire or check)",
      "Leave home clean and ready for new owners",
      "Provide any warranties, manuals, and keys",
      "Celebrate your successful sale!",
    ],
  },
];

const sellingTips = [
  {
    title: "Best Time to Sell",
    description:
      "Spring and early summer typically see the most buyer activity, but local market conditions vary.",
    icon: Calendar,
  },
  {
    title: "Pricing Strategy",
    description:
      "Homes priced right from the start sell faster and often for more than those that sit on the market.",
    icon: TrendingUp,
  },
  {
    title: "Disclosure Requirements",
    description:
      "Be honest about known issues. Failing to disclose can lead to legal problems after closing.",
    icon: FileText,
  },
  {
    title: "Negotiation Power",
    description:
      "Multiple offers give you leverage. Price competitively to generate interest and competition.",
    icon: DollarSign,
  },
];

export default function SellingGuidePage() {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadForm.name,
          email: leadForm.email,
          phone: leadForm.phone,
          source: "selling_guide",
          notes: `Property Address: ${leadForm.address || "Not provided"} - Downloaded Seller's Guide PDF`,
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
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            href="/"
            className="inline-flex items-center text-amber-100 hover:text-white mb-6 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold">Home Seller&apos;s Guide</h1>
          </div>
          <p className="text-xl text-amber-100 max-w-2xl mb-8">
            Maximize your home&apos;s value and sell with confidence. Our complete
            guide covers everything from preparation to closing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowLeadForm(true)}
              className="bg-white text-amber-600 hover:bg-amber-50 font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Free PDF Guide
            </button>
            <Link
              href="/#valuation"
              className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
            >
              <DollarSign className="w-5 h-5" />
              Get Free Home Valuation
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            {sellingTips.map((tip, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <tip.icon className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {tip.title}
                </h3>
                <p className="text-sm text-gray-600">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            7 Steps to Selling Your Home
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Follow this proven process to sell your home quickly and for top
            dollar.
          </p>
        </div>

        <div className="space-y-8">
          {sellingSteps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-amber-500 to-orange-600 p-8 text-white">
                  <div className="text-6xl font-bold text-white/20 mb-4">
                    {step.number}
                  </div>
                  <step.icon className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-amber-100">{step.description}</p>
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

      {/* Staging Checklist */}
      <div className="bg-amber-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Home Staging Checklist
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Interior</h3>
                <ul className="space-y-2">
                  {[
                    "Declutter all rooms and closets",
                    "Deep clean floors and carpets",
                    "Wash all windows inside and out",
                    "Paint walls in neutral colors",
                    "Fix any visible damage or repairs",
                    "Update outdated light fixtures",
                    "Remove personal photos and items",
                    "Organize pantry and cabinets",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <div className="w-5 h-5 border-2 border-gray-300 rounded" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Exterior</h3>
                <ul className="space-y-2">
                  {[
                    "Power wash driveway and walkways",
                    "Trim bushes and mow lawn",
                    "Add fresh mulch to flower beds",
                    "Paint or stain front door",
                    "Clean gutters and downspouts",
                    "Replace worn house numbers",
                    "Add potted plants or flowers",
                    "Repair any fence damage",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <div className="w-5 h-5 border-2 border-gray-300 rounded" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Sell Your Home?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Get a free, no-obligation home valuation and learn how much your
            home is worth in today&apos;s market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#valuation"
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <DollarSign className="w-5 h-5" />
              Get Free Valuation
            </Link>
            <Link
              href="/#contact"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Talk to an Agent
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
                <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  Get Your Free Seller&apos;s Guide
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                  Download our comprehensive guide to selling your home for top
                  dollar.
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
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="john@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={leadForm.phone}
                        onChange={(e) =>
                          setLeadForm({ ...leadForm, phone: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Address (optional)
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={leadForm.address}
                        onChange={(e) =>
                          setLeadForm({ ...leadForm, address: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="123 Main St, Houston, TX"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
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
                  We&apos;ve sent your Seller&apos;s Guide to your inbox. Good luck
                  with your sale!
                </p>
                <button
                  onClick={() => {
                    setShowLeadForm(false);
                    setLeadSubmitted(false);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
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
