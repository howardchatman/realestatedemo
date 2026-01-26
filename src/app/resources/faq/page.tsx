"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  HelpCircle,
  ChevronDown,
  Search,
  Phone,
  Mail,
  MessageCircle,
  DollarSign,
  FileText,
  Key,
  Building,
  Users,
  Clock,
  Shield,
} from "lucide-react";

const faqCategories = [
  {
    id: "buying",
    name: "Buying a Home",
    icon: Key,
    color: "bg-blue-500",
    faqs: [
      {
        question: "How do I know how much home I can afford?",
        answer:
          "A general rule is that your monthly housing costs shouldn't exceed 28-30% of your gross monthly income. Use our mortgage calculator to get a more accurate estimate. Factors include your income, debts, credit score, and down payment amount. Getting pre-approved for a mortgage will give you the most accurate picture of your buying power.",
      },
      {
        question: "What credit score do I need to buy a house?",
        answer:
          "Credit requirements vary by loan type. Conventional loans typically require 620+, FHA loans accept 580+ (or 500+ with 10% down), and VA loans generally require 620+. However, higher credit scores qualify you for better interest rates, which can save you thousands over the life of your loan.",
      },
      {
        question: "How much should I save for a down payment?",
        answer:
          "While 20% down avoids Private Mortgage Insurance (PMI), many buyers put down less. FHA loans require just 3.5% down, and some conventional loans allow 3% down. VA and USDA loans may require no down payment at all. Consider your financial situation and discuss options with a lender.",
      },
      {
        question: "What are closing costs and how much should I expect?",
        answer:
          "Closing costs typically range from 2-5% of the purchase price and include lender fees, title insurance, appraisal fees, attorney fees, and prepaid items like property taxes and insurance. On a $400,000 home, expect $8,000-$20,000 in closing costs.",
      },
      {
        question: "How long does the home buying process take?",
        answer:
          "From the time you make an offer to closing typically takes 30-45 days. However, the entire process—including getting pre-approved, searching for homes, and making offers—can take 2-6 months depending on market conditions and your specific situation.",
      },
      {
        question: "Should I get a home inspection?",
        answer:
          "Absolutely! A home inspection is one of the most important steps in buying a home. It can reveal hidden issues like foundation problems, roof damage, or electrical issues that could cost thousands to repair. The inspection typically costs $300-$500 and is well worth the investment.",
      },
    ],
  },
  {
    id: "selling",
    name: "Selling Your Home",
    icon: DollarSign,
    color: "bg-amber-500",
    faqs: [
      {
        question: "When is the best time to sell my home?",
        answer:
          "Spring and early summer (March-June) typically see the most buyer activity and highest sale prices. However, local market conditions vary. In competitive markets, homes sell well year-round. Consult with a local agent to understand your specific market timing.",
      },
      {
        question: "How do I determine my home's value?",
        answer:
          "The best way is to get a Comparative Market Analysis (CMA) from a real estate agent, which analyzes recent sales of similar homes in your area. You can also use our free home valuation tool for an instant estimate, though a professional appraisal provides the most accurate value.",
      },
      {
        question: "Should I make repairs before selling?",
        answer:
          "Focus on repairs that buyers will notice: fix leaky faucets, replace broken tiles, patch holes in walls, and address any safety issues. Major renovations often don't provide full return on investment. Cosmetic updates like fresh paint and landscaping typically offer the best ROI.",
      },
      {
        question: "How long will it take to sell my home?",
        answer:
          "Average time on market varies by location and price point. In hot markets, homes may sell within days. In slower markets, it could take months. Pricing your home correctly from the start is the best way to ensure a quick sale. Overpriced homes often sit longer and sell for less.",
      },
      {
        question: "What costs are involved in selling a home?",
        answer:
          "Typical seller costs include: agent commission (5-6% of sale price), closing costs (1-3%), repairs/staging, and potential capital gains taxes. On a $400,000 sale, expect total costs of $24,000-$36,000. Your net proceeds will be the sale price minus these costs and your remaining mortgage.",
      },
      {
        question: "Do I need to stage my home?",
        answer:
          "Staging can help your home sell faster and for more money. Studies show staged homes sell 73% faster on average. At minimum, declutter, deep clean, and depersonalize. Professional staging costs $1,000-$3,000 but often provides excellent return on investment.",
      },
    ],
  },
  {
    id: "financing",
    name: "Financing & Mortgages",
    icon: FileText,
    color: "bg-emerald-500",
    faqs: [
      {
        question: "What's the difference between pre-qualification and pre-approval?",
        answer:
          "Pre-qualification is a quick estimate based on self-reported information. Pre-approval is a more thorough process where the lender verifies your income, assets, and credit. Pre-approval carries more weight with sellers and gives you a more accurate budget. Always get pre-approved before house hunting.",
      },
      {
        question: "What types of mortgages are available?",
        answer:
          "Common options include: Conventional loans (best rates for good credit), FHA loans (lower credit/down payment requirements), VA loans (for veterans, no down payment), USDA loans (rural areas, no down payment), and Jumbo loans (for high-priced homes). Each has different requirements and benefits.",
      },
      {
        question: "Should I choose a fixed or adjustable rate mortgage?",
        answer:
          "Fixed-rate mortgages offer predictable payments and protection from rising rates—ideal for long-term homeowners. Adjustable-rate mortgages (ARMs) start with lower rates but can increase over time. ARMs may be suitable if you plan to sell or refinance within 5-7 years.",
      },
      {
        question: "What is PMI and how can I avoid it?",
        answer:
          "Private Mortgage Insurance (PMI) is required when you put less than 20% down on a conventional loan. It typically costs 0.5-1% of the loan annually. You can avoid PMI by putting 20% down, using a VA loan, or through lender-paid PMI (higher interest rate). PMI can be removed once you reach 20% equity.",
      },
      {
        question: "Can I buy a home with student loans?",
        answer:
          "Yes! Student loans affect your debt-to-income ratio, but many people with student debt successfully buy homes. Lenders look at your monthly payment, not total balance. Income-driven repayment plans can lower your monthly payment, improving your debt-to-income ratio.",
      },
    ],
  },
  {
    id: "process",
    name: "Working With Us",
    icon: Users,
    color: "bg-purple-500",
    faqs: [
      {
        question: "How do I schedule a showing?",
        answer:
          "You can schedule a showing by clicking 'Schedule Showing' on any listing, calling us at (832) 770-7998, or using our AI assistant AIVA available 24/7 on our website. We typically can arrange showings within 24-48 hours of your request.",
      },
      {
        question: "Do I need to sign a contract to work with you?",
        answer:
          "For buyers, we typically use a buyer representation agreement that outlines our services and commission structure. For sellers, we use a listing agreement. These contracts protect both parties and ensure clear expectations. We're happy to explain all terms before you sign.",
      },
      {
        question: "How does your AI assistant AIVA work?",
        answer:
          "AIVA is our 24/7 AI-powered assistant that can answer questions about listings, schedule showings, provide market information, and connect you with a human agent when needed. AIVA uses advanced AI to understand your needs and provide helpful, accurate responses.",
      },
      {
        question: "What areas do you serve?",
        answer:
          "We primarily serve the Houston metropolitan area, including Downtown, The Heights, Montrose, River Oaks, Memorial, Katy, Sugar Land, The Woodlands, and surrounding communities. Contact us to see if we serve your specific area.",
      },
      {
        question: "How are real estate agents paid?",
        answer:
          "Agent commissions are typically paid by the seller at closing. The total commission (usually 5-6%) is split between the listing agent and buyer's agent. As a buyer, you generally don't pay your agent directly—their commission comes from the sale proceeds.",
      },
    ],
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("buying");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const filteredFaqs = searchQuery
    ? faqCategories.flatMap((cat) =>
        cat.faqs
          .filter(
            (faq) =>
              faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((faq) => ({ ...faq, category: cat.name }))
      )
    : [];

  const currentCategory = faqCategories.find((c) => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            href="/"
            className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mb-8">
            Find answers to common questions about buying, selling, and
            financing your home.
          </p>

          {/* Search */}
          <div className="max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers..."
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Search Results ({filteredFaqs.length})
          </h2>
          {filteredFaqs.length > 0 ? (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedFaq(
                        expandedFaq === `search-${index}`
                          ? null
                          : `search-${index}`
                      )
                    }
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <span className="text-xs text-emerald-600 font-medium">
                        {faq.category}
                      </span>
                      <p className="font-semibold text-gray-900">
                        {faq.question}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedFaq === `search-${index}` ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedFaq === `search-${index}` && (
                    <div className="px-6 pb-4 text-gray-600">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">
                No results found for &quot;{searchQuery}&quot;
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Try different keywords or browse categories below
              </p>
            </div>
          )}
        </div>
      )}

      {/* Categories & FAQs */}
      {!searchQuery && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Category Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-4 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <nav className="space-y-2">
                  {faqCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeCategory === category.id
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center`}
                      >
                        <category.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* FAQ List */}
            <div className="lg:col-span-3">
              {currentCategory && (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`w-12 h-12 ${currentCategory.color} rounded-xl flex items-center justify-center`}
                    >
                      <currentCategory.icon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {currentCategory.name}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {currentCategory.faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl shadow-lg overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setExpandedFaq(
                              expandedFaq === `${activeCategory}-${index}`
                                ? null
                                : `${activeCategory}-${index}`
                            )
                          }
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-semibold text-gray-900 pr-4">
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                              expandedFaq === `${activeCategory}-${index}`
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>
                        {expandedFaq === `${activeCategory}-${index}` && (
                          <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Still Have Questions CTA */}
      <div className="bg-emerald-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
            Our team is here to help. Reach out anytime and we&apos;ll get back
            to you as soon as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+18327707998"
              className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-5 h-5" />
              (832) 770-7998
            </a>
            <Link
              href="/#contact"
              className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Send a Message
            </Link>
            <button
              onClick={() => {
                // Trigger AIVA chat
                const event = new CustomEvent("openAIVA");
                window.dispatchEvent(event);
              }}
              className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Chat with AIVA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
