"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare,
  Phone,
  BarChart3,
  Bot,
  Send,
  Play,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

const chatMessages = [
  { sender: "visitor", text: "Hi, I'm interested in the lakefront property" },
  { sender: "ai", text: "Hello! I'd be happy to help. The Modern Lakefront Estate is a stunning 5-bed, 4-bath home at $1,250,000. Would you like to schedule a showing?" },
  { sender: "visitor", text: "Yes, do you have availability this week?" },
  { sender: "ai", text: "I have Thursday at 2 PM or Friday at 10 AM available. Which works better for you?" },
  { sender: "visitor", text: "Thursday at 2 PM works great" },
  { sender: "ai", text: "Perfect! I've scheduled your showing for Thursday at 2 PM. You'll receive a confirmation email shortly. Is there anything else I can help with?" },
];

const callTranscript = [
  { speaker: "AI", text: "Good afternoon! Thank you for calling Chatman Real Estate. How can I help you today?" },
  { speaker: "Caller", text: "Hi, I saw your listing for the downtown condo..." },
  { speaker: "AI", text: "The Downtown Luxury Penthouse at 456 Main Street? That's a beautiful 3-bed unit at $895,000. Are you pre-approved for financing?" },
  { speaker: "Caller", text: "Yes, I'm pre-approved up to $950K" },
  { speaker: "AI", text: "Excellent! I can schedule a private showing for you. Would tomorrow afternoon work?" },
];

const dashboardStats = [
  { label: "New Leads", value: 47, change: "+12%", icon: Users },
  { label: "Response Rate", value: "98%", change: "+5%", icon: Zap },
  { label: "Avg Response", value: "< 30s", change: "-40%", icon: Clock },
  { label: "Conversions", value: 23, change: "+18%", icon: TrendingUp },
];

export default function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState<"chat" | "voice" | "dashboard">("chat");
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [visibleTranscript, setVisibleTranscript] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [statsAnimated, setStatsAnimated] = useState(false);

  // Animate chat messages
  useEffect(() => {
    if (activeTab === "chat" && visibleMessages < chatMessages.length) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
        setVisibleMessages((prev) => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [activeTab, visibleMessages]);

  // Animate voice transcript
  useEffect(() => {
    if (activeTab === "voice" && visibleTranscript < callTranscript.length) {
      const timer = setTimeout(() => {
        setVisibleTranscript((prev) => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [activeTab, visibleTranscript]);

  // Animate dashboard stats
  useEffect(() => {
    if (activeTab === "dashboard") {
      setStatsAnimated(true);
    }
  }, [activeTab]);

  // Reset animations when switching tabs
  useEffect(() => {
    if (activeTab === "chat") {
      setVisibleMessages(0);
    } else if (activeTab === "voice") {
      setVisibleTranscript(0);
    }
  }, [activeTab]);

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-sm font-medium mb-4">
            <Play className="w-4 h-4" />
            Interactive Demo
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            See Your AI Assistant in Action
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Watch how our AI handles leads 24/7, never missing a call or message
          </p>
        </div>

        {/* Demo Container */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-700">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all ${
                activeTab === "chat"
                  ? "bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-400"
                  : "text-gray-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>AI Chat</span>
            </button>
            <button
              onClick={() => setActiveTab("voice")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all ${
                activeTab === "voice"
                  ? "bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-400"
                  : "text-gray-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <Phone className="w-5 h-5" />
              <span>AI Voice</span>
            </button>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all ${
                activeTab === "dashboard"
                  ? "bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-400"
                  : "text-gray-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
          </div>

          {/* Demo Content */}
          <div className="p-6 md:p-8 min-h-[400px]">
            {/* Chat Demo */}
            {activeTab === "chat" && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-slate-900 rounded-2xl p-4 space-y-4 h-[350px] overflow-y-auto">
                  {chatMessages.slice(0, visibleMessages).map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.sender === "visitor" ? "justify-end" : "justify-start"} animate-fade-in`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                          msg.sender === "visitor"
                            ? "bg-emerald-500 text-white rounded-br-md"
                            : "bg-slate-700 text-gray-100 rounded-bl-md"
                        }`}
                      >
                        {msg.sender === "ai" && (
                          <div className="flex items-center gap-2 mb-1">
                            <Bot className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs text-emerald-400 font-medium">AI Assistant</span>
                          </div>
                        )}
                        <p className="text-sm">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  {isTyping && visibleMessages < chatMessages.length && chatMessages[visibleMessages]?.sender === "ai" && (
                    <div className="flex justify-start">
                      <div className="bg-slate-700 px-4 py-3 rounded-2xl rounded-bl-md">
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-emerald-400" />
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-2 bg-slate-700 rounded-xl px-4 py-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                    disabled
                  />
                  <button className="p-2 bg-emerald-500 rounded-lg text-white">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Voice Demo */}
            {activeTab === "voice" && (
              <div className="max-w-2xl mx-auto">
                {/* Call Header */}
                <div className="bg-slate-900 rounded-t-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Incoming Call</p>
                      <p className="text-sm text-gray-400">(555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-emerald-400 text-sm">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      Live
                    </span>
                    <span className="text-gray-400 text-sm">2:34</span>
                  </div>
                </div>

                {/* Waveform Animation */}
                <div className="bg-slate-800 p-4 flex items-center justify-center gap-1">
                  {[...Array(40)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-emerald-500 rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 30 + 10}px`,
                        animationDelay: `${i * 50}ms`,
                      }}
                    />
                  ))}
                </div>

                {/* Transcript */}
                <div className="bg-slate-900 rounded-b-2xl p-4 space-y-3 h-[200px] overflow-y-auto">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Live Transcript</p>
                  {callTranscript.slice(0, visibleTranscript).map((line, index) => (
                    <div key={index} className="flex gap-3 animate-fade-in">
                      <span className={`text-xs font-medium ${line.speaker === "AI" ? "text-emerald-400" : "text-blue-400"}`}>
                        {line.speaker}:
                      </span>
                      <p className="text-sm text-gray-300">{line.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dashboard Demo */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {dashboardStats.map((stat, index) => (
                    <div
                      key={index}
                      className={`bg-slate-900 rounded-xl p-4 transform transition-all duration-500 ${
                        statsAnimated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <stat.icon className="w-5 h-5 text-emerald-400" />
                        <span className="text-xs text-emerald-400 font-medium">{stat.change}</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="bg-slate-900 rounded-xl p-4">
                  <h4 className="text-white font-medium mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    {[
                      { action: "New lead captured", source: "Chat Widget", time: "2 min ago", icon: MessageSquare },
                      { action: "Showing scheduled", source: "AI Voice Call", time: "15 min ago", icon: CheckCircle },
                      { action: "Property inquiry", source: "Website Form", time: "32 min ago", icon: Users },
                      { action: "Follow-up sent", source: "Automated Email", time: "1 hour ago", icon: Send },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-all duration-500 ${
                          statsAnimated ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                        }`}
                        style={{ transitionDelay: `${400 + index * 100}ms` }}
                      >
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                          <activity.icon className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white">{activity.action}</p>
                          <p className="text-xs text-gray-400">{activity.source}</p>
                        </div>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA Below Demo */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-4">Ready to see your leads handled automatically?</p>
          <a
            href="/demo"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
          >
            Try the Full Demo
            <Play className="w-5 h-5" />
          </a>
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
