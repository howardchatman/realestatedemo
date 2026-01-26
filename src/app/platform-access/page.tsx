"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  MessageSquare,
  Users,
  ArrowRight,
  Check,
  X,
  ChevronRight,
  Zap,
  Clock,
  Target,
  Star,
  Layers,
  TrendingUp,
} from "lucide-react";

// Application Modal Component
function ApplicationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    brokerage: "",
    email: "",
    phone: "",
    role: "",
    hasMlsAccess: "",
    biggestProblem: "",
    notes: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Apply for Your Own Platform
              </h2>
              <p className="text-sm text-gray-500">
                Get your own branded real estate platform.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Application received.
                </h3>
                <p className="text-gray-600">We'll reach out shortly.</p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brokerage / Team{" "}
                    <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="brokerage"
                    value={formData.brokerage}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="RE/MAX, Keller Williams, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select your role</option>
                    <option value="agent">Agent</option>
                    <option value="broker">Broker</option>
                    <option value="team_owner">Team Owner</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Do you have MLS access? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasMlsAccess"
                        value="yes"
                        required
                        checked={formData.hasMlsAccess === "yes"}
                        onChange={handleChange}
                        className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasMlsAccess"
                        value="no"
                        checked={formData.hasMlsAccess === "no"}
                        onChange={handleChange}
                        className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Biggest problem <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="biggestProblem"
                    required
                    value={formData.biggestProblem}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select your biggest challenge</option>
                    <option value="missing_calls">Missing calls and leads</option>
                    <option value="follow_up">Forgetting to follow up</option>
                    <option value="too_many_tools">Too many tools to manage</option>
                    <option value="lead_quality">
                      Can't tell which leads are worth my time
                    </option>
                    <option value="no_time">
                      Not enough hours in the day
                    </option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes <span className="text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    placeholder="Anything else you'd like us to know?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Header with Chatman RP branding
function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-white">Chatman RP</span>
            <span className="hidden sm:inline text-gray-400 text-sm ml-3">
              Relationship Platform for Real Estate
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

// Hero Section
function HeroSection({ onApply }: { onApply: () => void }) {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      <Header />
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80"
          alt="Luxury modern home"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/50 to-gray-900/70" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            What if your business ran itself
            <span className="block text-emerald-400 mt-2">
              while you showed homes?
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Get your own AI-powered real estate platform that handles calls, follows up with leads,
            and tells you exactly who needs your attention — so you can focus on closing deals.
          </p>

          <div className="flex flex-col items-center">
            <button
              onClick={onApply}
              className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:scale-105"
            >
              Apply for Your Own Platform
            </button>
            <p className="text-gray-500 text-sm mt-3">
              Your brand. Your leads. Your platform.
            </p>
            <Link
              href="/demo"
              className="mt-6 text-gray-400 hover:text-emerald-400 transition-colors flex items-center text-sm"
            >
              See How It Works
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Problem-Solution Section Component
function ProblemSolutionSection({
  problem,
  solutions,
  icon: Icon,
  isReversed,
  image,
  sectionTitle,
}: {
  problem: string;
  solutions: string[];
  icon: React.ElementType;
  isReversed: boolean;
  image?: string;
  sectionTitle?: string;
}) {
  // If there's an image, use a different layout
  if (image) {
    return (
      <section className={`py-20 ${isReversed ? "bg-gray-200" : "bg-white"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {sectionTitle && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-xl">
                  <Icon className="w-7 h-7 text-red-500" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-red-500">
                  {sectionTitle}
                </h2>
              </div>
              <p className="text-gray-500 text-xl font-bold">Sound familiar?</p>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12`}
          >
            {/* Content Side */}
            <div className="flex-1">
              {!sectionTitle && (
                <>
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-xl mb-6">
                    <Icon className="w-7 h-7 text-red-500" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    {problem}
                  </h3>
                  <p className="text-gray-500 text-lg mb-8">Sound familiar?</p>
                </>
              )}

              <h4 className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-6">
                How Chatman RP makes it better:
              </h4>
              <ul className="space-y-3">
                {solutions.map((solution, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-700 text-lg">{solution}</p>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Image Side */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-2xl overflow-hidden shadow-2xl"
              >
                <img
                  src={image}
                  alt="Chatman RP Dashboard"
                  className="w-full h-auto"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-20 ${isReversed ? "bg-gray-200" : "bg-white"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {sectionTitle && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-xl">
                <Icon className="w-7 h-7 text-red-500" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-red-500">
                {sectionTitle}
              </h2>
            </div>
            <p className="text-gray-500 text-xl font-bold">Sound familiar?</p>
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h4 className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-6 text-center">
            How Chatman RP makes it better:
          </h4>
          <ul className="space-y-3">
            {solutions.map((solution, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-start space-x-3"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-700 text-lg">{solution}</p>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    "Lead reaches out",
    "AI answers instantly",
    "Conversation saved",
    "Lead scored",
    "Follow-up continues",
    "You step in",
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-16 text-center">
            How It Works
          </h2>

          <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center"
              >
                <div className="px-5 py-3 bg-gray-100 rounded-xl text-gray-800 font-medium">
                  {step}
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-emerald-500 mx-2 flex-shrink-0" />
                )}
              </motion.div>
            ))}
          </div>

          <p className="text-center text-gray-500">
            MLS enhances this flow with live inventory.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Competitor Comparison Section
function ComparisonSection() {
  const features = [
    { name: "AI Answers Calls 24/7", chatman: true, place: true, boomtown: false, kvcore: false },
    { name: "AI Answers Chats 24/7", chatman: true, place: true, boomtown: false, kvcore: false },
    { name: "Automatic Lead Scoring", chatman: true, place: true, boomtown: true, kvcore: true },
    { name: "Automatic Follow-Up", chatman: true, place: true, boomtown: true, kvcore: true },
    { name: "Call Recording & Transcripts", chatman: true, place: null, boomtown: false, kvcore: false },
    { name: "Brokerage Agnostic", chatman: true, place: true, boomtown: false, kvcore: false },
    { name: "No Per-User Fees", chatman: true, place: false, boomtown: false, kvcore: false },
  ];

  const pricing = {
    chatman: "Early Access",
    place: "$$$$",
    boomtown: "$1,000+/mo",
    kvcore: "$499+/mo",
  };

  const renderCheck = (value: boolean | null) => {
    if (value === null) return <span className="text-gray-400">?</span>;
    if (value) return <Check className="w-5 h-5 text-emerald-500 mx-auto" />;
    return <X className="w-5 h-5 text-gray-300 mx-auto" />;
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 text-center">
            How Chatman RP Compares
          </h2>
          <p className="text-gray-500 text-center mb-12">
            We're not saying they're bad — we're just built different.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-sm overflow-hidden">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold text-emerald-600 bg-emerald-50">Chatman RP</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-600">Place</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-600">BoomTown</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-600">kvCORE</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-gray-700">{feature.name}</td>
                    <td className="py-4 px-4 bg-emerald-50/50">{renderCheck(feature.chatman)}</td>
                    <td className="py-4 px-4">{renderCheck(feature.place)}</td>
                    <td className="py-4 px-4">{renderCheck(feature.boomtown)}</td>
                    <td className="py-4 px-4">{renderCheck(feature.kvcore)}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td className="py-4 px-6 font-semibold text-gray-900">Starting Price</td>
                  <td className="py-4 px-4 text-center font-semibold text-emerald-600 bg-emerald-50">{pricing.chatman}</td>
                  <td className="py-4 px-4 text-center text-gray-600">{pricing.place}</td>
                  <td className="py-4 px-4 text-center text-gray-600">{pricing.boomtown}</td>
                  <td className="py-4 px-4 text-center text-gray-600">{pricing.kvcore}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Why Early Access Section
function WhyEarlyAccessSection() {
  const benefits = [
    { icon: Star, text: "Locked-in early access pricing" },
    { icon: Zap, text: "Priority onboarding" },
    { icon: MessageSquare, text: "Direct influence on product direction" },
    { icon: TrendingUp, text: "First access to MLS integrations" },
  ];

  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12 text-center">
            Why Apply Now
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center space-x-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="text-gray-300 text-lg">{benefit.text}</p>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-xl text-white">
            This is not a discount.{" "}
            <span className="text-emerald-400 font-semibold">
              It's early positioning.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Final CTA Section
function FinalCtaSection({ onApply }: { onApply: () => void }) {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
            Ready to get your own platform?
          </h2>

          <button
            onClick={onApply}
            className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:scale-105"
          >
            Apply for Your Own Platform
          </button>

          <p className="text-gray-500 text-sm mt-4">
            Your own branded platform. Limited spots available.
          </p>

          <Link
            href="/demo"
            className="mt-6 inline-flex items-center text-gray-400 hover:text-emerald-400 transition-colors text-sm"
          >
            See How It Works
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Simple Footer
function SimpleFooter() {
  return (
    <footer className="py-8 bg-gray-950 border-t border-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Chatman RP
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link
              href="/privacy"
              className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Problem-Solution Data
const problemSolutions = [
  {
    problem: "You're missing calls while showing homes",
    solutions: [
      "AI answers every call instantly, 24/7",
      "Captures lead info and books appointments automatically",
      "You get a summary of what they need — ready when you are",
    ],
    icon: Phone,
    image: "/images/demo_image_3.jpg",
    sectionTitle: "You're missing calls while showing homes.",
  },
  {
    problem: "Leads slip through the cracks",
    solutions: [
      "Automatic follow-up that never forgets",
      "Every conversation saved and searchable",
      "See exactly who needs attention right now",
    ],
    icon: Users,
    image: "/images/demo_image_4.png",
    sectionTitle: "Leads slip through the cracks.",
  },
  {
    problem: "You can't tell who's ready to buy",
    solutions: [
      "Leads scored as Hot, Warm, or Cold",
      "Prioritized dashboard shows who to call first",
      "Stop wasting time on cold leads",
    ],
    icon: Target,
    sectionTitle: "You can't tell who's ready to buy.",
  },
  {
    problem: "Too many tools that don't talk to each other",
    solutions: [
      "One platform: calls, chats, follow-up, scheduling",
      "Everything in one place, fully integrated",
      "No more app-switching or lost context",
    ],
    icon: Layers,
    image: "/images/demo_image_2.jpg",
    sectionTitle: "Too many tools that don't talk to each other.",
  },
  {
    problem: "You're working more but closing the same",
    solutions: [
      "Leverage without hiring staff",
      "AI handles the grind, you handle the relationships",
      "More listings without more hours",
    ],
    icon: Clock,
    sectionTitle: "You're working more but closing the same.",
  },
];

// Main Page Component
export default function PlatformAccessPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApply = () => {
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen">
      <HeroSection onApply={handleApply} />

      {problemSolutions.map((ps, index) => (
        <ProblemSolutionSection
          key={index}
          problem={ps.problem}
          solutions={ps.solutions}
          icon={ps.icon}
          isReversed={index % 2 === 1}
          image={ps.image}
          sectionTitle={ps.sectionTitle}
        />
      ))}

      <HowItWorksSection />
      <ComparisonSection />
      <WhyEarlyAccessSection />
      <FinalCtaSection onApply={handleApply} />
      <SimpleFooter />

      <ApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
