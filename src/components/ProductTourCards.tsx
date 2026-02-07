"use client";

import { useState } from "react";
import {
  MessageSquare,
  Phone,
  Brain,
  Calendar,
  BarChart3,
  Globe,
  ChevronRight,
  Check,
  Sparkles,
} from "lucide-react";

const features = [
  {
    id: "chat",
    icon: MessageSquare,
    title: "AI Chat Widget",
    subtitle: "24/7 Website Engagement",
    color: "emerald",
    description: "Intelligent chat that answers questions, qualifies leads, and schedules showings automatically.",
    benefits: [
      "Instant responses to property inquiries",
      "Automated lead qualification",
      "Smart appointment scheduling",
      "Multilingual support",
    ],
    stats: { metric: "98%", label: "Response Rate" },
    image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=600&q=80",
  },
  {
    id: "voice",
    icon: Phone,
    title: "AI Voice Agent",
    subtitle: "Never Miss a Call",
    color: "blue",
    description: "Human-like voice AI that handles inbound calls, answers questions, and captures leads.",
    benefits: [
      "Natural conversation flow",
      "Real-time call transcription",
      "Instant lead capture to CRM",
      "Custom voice & personality",
    ],
    stats: { metric: "< 1s", label: "Answer Time" },
    image: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=600&q=80",
  },
  {
    id: "ai",
    icon: Brain,
    title: "Smart Lead Scoring",
    subtitle: "Focus on Hot Leads",
    color: "purple",
    description: "AI analyzes every interaction to score and prioritize leads by buying intent.",
    benefits: [
      "Automatic lead temperature rating",
      "Financing status detection",
      "Timeline prediction",
      "Follow-up recommendations",
    ],
    stats: { metric: "3x", label: "Conversion Rate" },
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
  },
  {
    id: "calendar",
    icon: Calendar,
    title: "Smart Scheduling",
    subtitle: "Automated Appointments",
    color: "orange",
    description: "AI coordinates showings, syncs calendars, and sends reminders automatically.",
    benefits: [
      "Calendar integration (Google, Outlook)",
      "Automatic conflict detection",
      "SMS & email reminders",
      "Rescheduling made easy",
    ],
    stats: { metric: "85%", label: "Show Rate" },
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&q=80",
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Real-Time Analytics",
    subtitle: "Data-Driven Insights",
    color: "pink",
    description: "Track performance, understand trends, and optimize your lead generation strategy.",
    benefits: [
      "Lead source attribution",
      "Conversion funnel analysis",
      "Response time metrics",
      "ROI tracking",
    ],
    stats: { metric: "100%", label: "Visibility" },
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
  },
  {
    id: "website",
    icon: Globe,
    title: "IDX Website",
    subtitle: "Your Digital Presence",
    color: "teal",
    description: "Beautiful, fast websites with MLS integration and AI-powered property search.",
    benefits: [
      "IDX/MLS integration",
      "AI property recommendations",
      "Mobile-optimized design",
      "SEO-friendly structure",
    ],
    stats: { metric: "2x", label: "More Leads" },
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
  },
];

const colorClasses = {
  emerald: {
    bg: "bg-emerald-500",
    bgLight: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "border-emerald-500/20",
    hover: "hover:border-emerald-500/50",
    gradient: "from-emerald-500 to-teal-500",
  },
  blue: {
    bg: "bg-blue-500",
    bgLight: "bg-blue-500/10",
    text: "text-blue-500",
    border: "border-blue-500/20",
    hover: "hover:border-blue-500/50",
    gradient: "from-blue-500 to-cyan-500",
  },
  purple: {
    bg: "bg-purple-500",
    bgLight: "bg-purple-500/10",
    text: "text-purple-500",
    border: "border-purple-500/20",
    hover: "hover:border-purple-500/50",
    gradient: "from-purple-500 to-pink-500",
  },
  orange: {
    bg: "bg-orange-500",
    bgLight: "bg-orange-500/10",
    text: "text-orange-500",
    border: "border-orange-500/20",
    hover: "hover:border-orange-500/50",
    gradient: "from-orange-500 to-amber-500",
  },
  pink: {
    bg: "bg-pink-500",
    bgLight: "bg-pink-500/10",
    text: "text-pink-500",
    border: "border-pink-500/20",
    hover: "hover:border-pink-500/50",
    gradient: "from-pink-500 to-rose-500",
  },
  teal: {
    bg: "bg-teal-500",
    bgLight: "bg-teal-500/10",
    text: "text-teal-500",
    border: "border-teal-500/20",
    hover: "hover:border-teal-500/50",
    gradient: "from-teal-500 to-cyan-500",
  },
};

export default function ProductTourCards() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Platform Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need to Dominate Your Market
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A complete AI-powered platform designed specifically for real estate professionals
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const colors = colorClasses[feature.color as keyof typeof colorClasses];
            const isExpanded = expandedCard === feature.id;

            return (
              <div
                key={feature.id}
                className={`relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border ${colors.border} ${colors.hover} transition-all duration-300 overflow-hidden cursor-pointer group ${
                  isExpanded ? "md:col-span-2 lg:col-span-2" : ""
                }`}
                onClick={() => setExpandedCard(isExpanded ? null : feature.id)}
              >
                {/* Card Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${colors.bgLight} rounded-xl flex items-center justify-center`}>
                      <feature.icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div className={`px-3 py-1 ${colors.bgLight} rounded-full`}>
                      <span className={`text-sm font-bold ${colors.text}`}>{feature.stats.metric}</span>
                      <span className="text-xs text-gray-400 ml-1">{feature.stats.label}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">{feature.subtitle}</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>

                  {/* Expand indicator */}
                  <div className="flex items-center gap-2 mt-4 text-sm text-gray-400 group-hover:text-white transition-colors">
                    <span>{isExpanded ? "Click to collapse" : "Click to learn more"}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 animate-fade-in">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Benefits List */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                          Key Benefits
                        </h4>
                        {feature.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className={`w-5 h-5 ${colors.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-gray-300 text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>

                      {/* Feature Image */}
                      <div className="relative h-48 rounded-xl overflow-hidden">
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="w-full h-full object-cover"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${colors.gradient} opacity-20`} />
                      </div>
                    </div>

                    {/* CTA Button */}
                    <a
                      href="/demo"
                      className={`inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r ${colors.gradient} text-white rounded-xl font-semibold hover:opacity-90 transition-opacity`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Try {feature.title}
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                )}

                {/* Hover Gradient Border Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none`} />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-6">Ready to transform your real estate business?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/demo"
              className="px-8 py-4 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
            >
              Start Free Trial
            </a>
            <a
              href="/demo/admin"
              className="px-8 py-4 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-600 transition-colors"
            >
              View Admin Dashboard
            </a>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
