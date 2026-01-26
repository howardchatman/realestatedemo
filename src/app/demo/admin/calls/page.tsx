"use client";

import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  Phone,
  Search,
  Play,
  Download,
  Clock,
  TrendingUp,
  ThumbsUp,
  Minus,
  User,
  Calendar,
  FileText,
} from "lucide-react";

const mockCalls = [
  { id: 1, caller: "Robert Martinez", phone: "(555) 111-2222", duration: "8:42", sentiment: "positive", summary: "Interested in warehouse property in Tech Park, cash buyer, wants to schedule viewing", date: "Today, 3:45 PM", transcript: true },
  { id: 2, caller: "Unknown", phone: "(555) 987-6543", duration: "3:24", sentiment: "positive", summary: "Looking for 3BR under $400K in Riverside, pre-approved with lender", date: "Today, 2:30 PM", transcript: true },
  { id: 3, caller: "Sarah Johnson", phone: "(555) 123-4567", duration: "5:12", sentiment: "positive", summary: "Follow-up on lakefront property in Oakwood, ready to make offer", date: "Today, 11:15 AM", transcript: true },
  { id: 4, caller: "Kevin Park", phone: "(555) 999-0000", duration: "6:33", sentiment: "positive", summary: "Inquiring about retail space downtown, owns restaurant chain", date: "Today, 9:20 AM", transcript: true },
  { id: 5, caller: "Unknown", phone: "(555) 456-7890", duration: "2:18", sentiment: "neutral", summary: "First-time buyer asking about starter homes under $300K", date: "Yesterday, 4:45 PM", transcript: true },
  { id: 6, caller: "Jennifer Lee", phone: "(555) 333-4444", duration: "4:51", sentiment: "positive", summary: "Looking for 4BR family home in Riverside, needs good schools nearby", date: "Yesterday, 2:10 PM", transcript: true },
  { id: 7, caller: "Thomas Wright", phone: "(555) 444-5555", duration: "7:15", sentiment: "neutral", summary: "Exploring office space options for expanding business, 5000+ sqft needed", date: "Yesterday, 10:30 AM", transcript: true },
  { id: 8, caller: "Unknown", phone: "(555) 222-1111", duration: "1:45", sentiment: "neutral", summary: "General inquiry about commercial listings and investment properties", date: "2 days ago, 3:15 PM", transcript: true },
];

const getSentimentBadge = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
          <ThumbsUp className="w-3 h-3" /> Positive
        </span>
      );
    case "neutral":
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full flex items-center gap-1">
          <Minus className="w-3 h-3" /> Neutral
        </span>
      );
    case "negative":
      return (
        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
          Negative
        </span>
      );
    default:
      return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{sentiment}</span>;
  }
};

const parseDuration = (duration: string) => {
  const [mins, secs] = duration.split(":").map(Number);
  return mins * 60 + secs;
};

export default function CallsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("all");

  const filteredCalls = mockCalls.filter((call) => {
    const matchesSearch = call.caller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.phone.includes(searchTerm);
    const matchesSentiment = sentimentFilter === "all" || call.sentiment === sentimentFilter;
    return matchesSearch && matchesSentiment;
  });

  const totalDuration = mockCalls.reduce((sum, c) => sum + parseDuration(c.duration), 0);
  const avgDuration = Math.floor(totalDuration / mockCalls.length);
  const positiveRate = Math.round((mockCalls.filter(c => c.sentiment === "positive").length / mockCalls.length) * 100);

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Call Log</h1>
        <p className="text-gray-500 mt-1">Review and manage AI voice call recordings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{mockCalls.length}</p>
              <p className="text-sm text-gray-500">Total Calls</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-emerald-600">{Math.floor(avgDuration / 60)}:{(avgDuration % 60).toString().padStart(2, "0")}</p>
              <p className="text-sm text-gray-500">Avg Duration</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">{positiveRate}%</p>
              <p className="text-sm text-gray-500">Positive Sentiment</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ThumbsUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">{mockCalls.filter(c => c.date.includes("Today")).length}</p>
              <p className="text-sm text-gray-500">Today's Calls</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 mb-6">
        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search calls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Sentiment</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Calls List */}
      <div className="space-y-4">
        {filteredCalls.map((call) => (
          <div key={call.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  call.caller !== "Unknown"
                    ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {call.caller !== "Unknown" ? (
                    <span className="font-semibold">{call.caller.split(" ").map(n => n[0]).join("")}</span>
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <h3 className="font-semibold text-gray-900">{call.caller}</h3>
                    {getSentimentBadge(call.sentiment)}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{call.phone}</p>
                  <p className="text-gray-600">{call.summary}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{call.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{call.date}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                  <Play className="w-4 h-4" />
                  <span>Play</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  <FileText className="w-4 h-4" />
                  <span>Transcript</span>
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Download">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
