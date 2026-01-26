"use client";

import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  MessageSquare,
  Search,
  Send,
  User,
  Clock,
  CheckCheck,
  Star,
  MoreVertical,
} from "lucide-react";

const mockConversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    avatar: "SJ",
    lastMessage: "Thank you! I'm very interested in the lakefront property. When can we schedule a viewing?",
    time: "2 min ago",
    unread: 2,
    isStarred: true,
    source: "Chat Widget",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@email.com",
    avatar: "MC",
    lastMessage: "I've reviewed the documents you sent. Everything looks good. Let's proceed with the offer.",
    time: "1 hour ago",
    unread: 0,
    isStarred: true,
    source: "AI Voice Call",
  },
  {
    id: 3,
    name: "Robert Martinez",
    email: "r.martinez@investco.com",
    avatar: "RM",
    lastMessage: "Can you send me more information about the commercial properties in the Tech Park area?",
    time: "3 hours ago",
    unread: 1,
    isStarred: false,
    source: "Contact Form",
  },
  {
    id: 4,
    name: "Jennifer Lee",
    email: "jlee@realestate.net",
    avatar: "JL",
    lastMessage: "Perfect, I'll see you at the property tomorrow at 2pm.",
    time: "Yesterday",
    unread: 0,
    isStarred: false,
    source: "Chat Widget",
  },
  {
    id: 5,
    name: "Emily Davis",
    email: "emily.d@email.com",
    avatar: "ED",
    lastMessage: "Hi, I'm looking for a 3-bedroom home in the Riverside area. What's available?",
    time: "Yesterday",
    unread: 3,
    isStarred: false,
    source: "Chat Widget",
  },
  {
    id: 6,
    name: "David Thompson",
    email: "dthompson@gmail.com",
    avatar: "DT",
    lastMessage: "Got it, thanks for the quick response!",
    time: "2 days ago",
    unread: 0,
    isStarred: false,
    source: "AI Voice Call",
  },
  {
    id: 7,
    name: "Marcus Johnson",
    email: "mjohnson@email.com",
    avatar: "MJ",
    lastMessage: "The maintenance issue has been resolved. Thank you for arranging that so quickly!",
    time: "2 days ago",
    unread: 0,
    isStarred: true,
    source: "Tenant Portal",
  },
  {
    id: 8,
    name: "Lisa Chen",
    email: "lchen@email.com",
    avatar: "LC",
    lastMessage: "When is a good time to discuss the lease renewal?",
    time: "3 days ago",
    unread: 1,
    isStarred: false,
    source: "Tenant Portal",
  },
];

const mockMessages = [
  { id: 1, sender: "Sarah Johnson", content: "Hi, I saw your listing for the Modern Lakefront Estate and I'm very interested!", time: "10:30 AM", isMe: false },
  { id: 2, sender: "You", content: "Hi Sarah! Thank you for reaching out. Yes, the Lakefront Estate at 123 Lakeview Drive is a beautiful 5-bedroom property. Would you like to know more about it?", time: "10:32 AM", isMe: true },
  { id: 3, sender: "Sarah Johnson", content: "Yes please! What's the asking price and is it available for a showing this week?", time: "10:35 AM", isMe: false },
  { id: 4, sender: "You", content: "The property is listed at $1,250,000. It features 5 bedrooms, 4 bathrooms, and 4,200 sq ft of living space with stunning lake views. I have availability Thursday and Friday this week for showings. Which day works better for you?", time: "10:38 AM", isMe: true },
  { id: 5, sender: "Sarah Johnson", content: "Thursday afternoon would be perfect! Around 2pm?", time: "10:40 AM", isMe: false },
  { id: 6, sender: "You", content: "Thursday at 2pm is confirmed! I'll send you the address and directions. Is there anything specific you'd like to know before the viewing?", time: "10:42 AM", isMe: true },
  { id: 7, sender: "Sarah Johnson", content: "Thank you! I'm very interested in the lakefront property. When can we schedule a viewing?", time: "10:45 AM", isMe: false },
];

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [newMessage, setNewMessage] = useState("");

  const filteredConversations = mockConversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUnread = mockConversations.reduce((sum, c) => sum + c.unread, 0);

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500 mt-1">
          {totalUnread} unread message{totalUnread !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Messages Container */}
      <div className="bg-white rounded-xl border border-gray-100 h-[calc(100%-80px)] flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-full md:w-96 border-r border-gray-100 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left ${
                  selectedConversation.id === conv.id ? "bg-emerald-50" : ""
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${
                  conv.unread > 0 ? "bg-gradient-to-br from-emerald-400 to-teal-500" : "bg-gray-300"
                }`}>
                  {conv.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium truncate ${conv.unread > 0 ? "text-gray-900" : "text-gray-600"}`}>
                        {conv.name}
                      </span>
                      {conv.isStarred && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{conv.time}</span>
                  </div>
                  <p className={`text-sm truncate mt-1 ${conv.unread > 0 ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                    {conv.lastMessage}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-400">{conv.source}</span>
                    {conv.unread > 0 && (
                      <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-medium rounded-full">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-col flex-1">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                {selectedConversation.avatar}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedConversation.name}</h3>
                <p className="text-sm text-gray-500">{selectedConversation.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg">
                <Star className={`w-5 h-5 ${selectedConversation.isStarred ? "text-yellow-500 fill-yellow-500" : ""}`} />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[70%] ${msg.isMe ? "order-2" : ""}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      msg.isMe
                        ? "bg-emerald-500 text-white rounded-br-md"
                        : "bg-gray-100 text-gray-900 rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <div className={`flex items-center gap-1 mt-1 ${msg.isMe ? "justify-end" : ""}`}>
                    <span className="text-xs text-gray-400">{msg.time}</span>
                    {msg.isMe && <CheckCheck className="w-4 h-4 text-emerald-500" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
