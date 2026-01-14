"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  X,
  Send,
  Phone,
  Calendar,
  Home,
  Sparkles,
  Bot,
  User,
  Minimize2,
} from "lucide-react";

interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
  time: string;
  options?: string[];
}

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "ai",
    text: "Hi! I'm AIVA, your AI real estate assistant. I'm here 24/7 to help you find your perfect home. How can I assist you today?",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    options: [
      "I'm looking to buy a home",
      "I want to sell my property",
      "Schedule a showing",
      "Get a home valuation",
    ],
  },
];

const aiResponses: { [key: string]: { text: string; options?: string[] } } = {
  "i'm looking to buy a home": {
    text: "That's exciting! I'd love to help you find your dream home. To give you the best recommendations, could you tell me what area you're interested in and your budget range?",
    options: ["Under $400K", "$400K - $600K", "$600K - $1M", "Over $1M"],
  },
  "i want to sell my property": {
    text: "I can definitely help with that! Would you like a free, instant AI-powered home valuation? Just share your address and I'll analyze recent sales in your area to give you an accurate estimate.",
    options: ["Get home valuation", "Talk to an agent", "Learn about selling process"],
  },
  "schedule a showing": {
    text: "I'd be happy to schedule a showing for you! Which property are you interested in? Or I can show you our featured listings and help you pick.",
    options: ["View featured listings", "I have an address", "Show available times"],
  },
  "get a home valuation": {
    text: "Great choice! Our AI valuation is 98% accurate and completely free. Just tell me your property address and I'll have your estimate in seconds.",
    options: ["Enter my address", "How does it work?", "Talk to an agent"],
  },
  "under $400k": {
    text: "Perfect! We have 47 beautiful homes under $400K. Popular areas in this range include Riverside, Oak Park, and Westside. Would you like to see our top picks or filter by bedrooms?",
    options: ["Show top picks", "2+ bedrooms", "3+ bedrooms", "Schedule tours"],
  },
  "$400k - $600k": {
    text: "Great range! We have 83 stunning properties in this budget. This opens up neighborhoods like Downtown, Lakefront, and Cherry Hills. What's most important to you in a home?",
    options: ["Modern updates", "Large yard", "Good schools", "Show me options"],
  },
  "$600k - $1m": {
    text: "Excellent! In this range, you'll find premium homes in our most desirable neighborhoods. We have 52 listings with luxury features. Would you like me to show you our bestsellers?",
    options: ["Show luxury homes", "Waterfront options", "New construction", "Schedule tours"],
  },
  "over $1m": {
    text: "You're looking at our premium collection! We have exclusive access to 28 luxury properties, including estates and waterfront homes. Would you like a private showing with our luxury specialist?",
    options: ["View luxury collection", "Private showing", "Talk to specialist"],
  },
  default: {
    text: "Thanks for your interest! I can help you with buying, selling, scheduling showings, or getting a home valuation. What would you like to explore?",
    options: ["Buy a home", "Sell my home", "Schedule showing", "Home valuation"],
  },
};

export default function AIVAChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-open after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowBubble(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let response = aiResponses.default;

      for (const key of Object.keys(aiResponses)) {
        if (lowerText.includes(key)) {
          response = aiResponses[key];
          break;
        }
      }

      const aiMessage: Message = {
        id: messages.length + 2,
        sender: "ai",
        text: response.text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        options: response.options,
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, aiMessage]);
    }, 1500);
  };

  const handleOptionClick = (option: string) => {
    handleSendMessage(option);
  };

  return (
    <>
      {/* Chat Bubble Notification */}
      {!isOpen && showBubble && (
        <div className="fixed bottom-24 right-6 z-40 animate-bounce">
          <div className="bg-white rounded-2xl shadow-xl p-4 max-w-xs border border-gray-100">
            <button
              onClick={() => setShowBubble(false)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">Hi! I&apos;m AIVA</span> - Need help finding a home? I&apos;m available 24/7!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowBubble(false);
          setIsMinimized(false);
        }}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 ${
          isOpen
            ? "bg-gray-800 rotate-0"
            : "bg-gradient-to-br from-emerald-400 to-teal-500"
        }`}
      >
        {isOpen ? (
          <X className="w-7 h-7 text-white" />
        ) : (
          <MessageSquare className="w-7 h-7 text-white" />
        )}
        {/* Pulse effect */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-25" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && !isMinimized && (
        <div className="fixed bottom-28 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col" style={{ height: "550px" }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">AIVA</h4>
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                  <span className="text-xs text-white/80">Online 24/7</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Minimize2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 p-3 bg-gray-50 border-b">
            <button className="flex items-center space-x-1 px-3 py-1.5 bg-white rounded-full text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors border border-gray-200">
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-1.5 bg-white rounded-full text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors border border-gray-200">
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-1.5 bg-white rounded-full text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors border border-gray-200">
              <Home className="w-4 h-4" />
              <span>Listings</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "ai" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mr-2 flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl rounded-tr-sm"
                        : "bg-white text-gray-800 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100"
                    } px-4 py-3`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span
                      className={`text-xs mt-1 block ${
                        message.sender === "user" ? "text-white/60" : "text-gray-400"
                      }`}
                    >
                      {message.time}
                    </span>
                  </div>
                  {message.sender === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ml-2 flex-shrink-0">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>

                {/* Quick Reply Options */}
                {message.sender === "ai" && message.options && (
                  <div className="flex flex-wrap gap-2 mt-3 ml-10">
                    {message.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleOptionClick(option)}
                        className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-600 text-sm rounded-full hover:bg-emerald-50 transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mr-2">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Powered by AIVA • Available 24/7
            </p>
          </div>
        </div>
      )}

      {/* Minimized Chat */}
      {isOpen && isMinimized && (
        <div
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-28 right-6 z-50 bg-white rounded-2xl shadow-xl p-4 cursor-pointer hover:shadow-2xl transition-all border border-gray-100"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">AIVA</h4>
              <p className="text-xs text-gray-500">Click to expand chat</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
