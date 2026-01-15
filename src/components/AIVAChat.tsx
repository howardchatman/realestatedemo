"use client";

import { useState, useEffect, useRef } from "react";
import { RetellWebClient } from "retell-client-js-sdk";
import {
  MessageSquare,
  X,
  Send,
  Phone,
  PhoneOff,
  Calendar,
  Home,
  Sparkles,
  Bot,
  User,
  Minimize2,
  BedDouble,
  Bath,
  Square,
  MapPin,
  Clock,
  CheckCircle,
  Volume2,
} from "lucide-react";

interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
  time: string;
  options?: string[];
  listings?: typeof mockListings;
  calendar?: boolean;
  callStarted?: boolean;
}

// Mock listings data
const mockListings = [
  {
    id: 1,
    title: "Modern Lakefront Estate",
    address: "123 Lakeview Drive",
    price: 1250000,
    beds: 5,
    baths: 4,
    sqft: 4200,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80",
    tag: "New Listing",
  },
  {
    id: 2,
    title: "Downtown Luxury Penthouse",
    address: "456 Main Street",
    price: 895000,
    beds: 3,
    baths: 2,
    sqft: 2100,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80",
    tag: "Featured",
  },
  {
    id: 3,
    title: "Charming Colonial Home",
    address: "789 Oak Street",
    price: 675000,
    beds: 4,
    baths: 3,
    sqft: 2800,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
    tag: "Open House",
  },
];

// Mock available times
const mockTimes = [
  { date: "Tomorrow", slots: ["10:00 AM", "2:00 PM", "4:30 PM"] },
  { date: "Wednesday", slots: ["9:00 AM", "11:30 AM", "3:00 PM"] },
  { date: "Thursday", slots: ["10:00 AM", "1:00 PM", "5:00 PM"] },
];

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

const aiResponses: { [key: string]: { text: string; options?: string[]; listings?: typeof mockListings; calendar?: boolean } } = {
  "i'm looking to buy a home": {
    text: "That's exciting! I'd love to help you find your dream home. To give you the best recommendations, could you tell me what area you're interested in and your budget range?",
    options: ["Under $400K", "$400K - $600K", "$600K - $1M", "Over $1M"],
  },
  "i want to sell my property": {
    text: "I can definitely help with that! Would you like a free, instant AI-powered home valuation? Just share your address and I'll analyze recent sales in your area to give you an accurate estimate.",
    options: ["Get home valuation", "Talk to an agent", "Learn about selling process"],
  },
  "schedule a showing": {
    text: "I'd be happy to schedule a showing for you! Here are some available time slots. Pick one that works best for you:",
    calendar: true,
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
  "show top picks": {
    text: "Here are our top-rated properties that match your criteria. Each one has been hand-selected based on value, location, and features:",
    listings: mockListings,
  },
  "show me options": {
    text: "Here are some stunning homes in your price range. I've selected these based on the best value and most popular features:",
    listings: mockListings,
  },
  "show luxury homes": {
    text: "Here's our curated collection of luxury properties. These homes feature premium finishes, smart home technology, and prime locations:",
    listings: mockListings,
  },
  "view luxury collection": {
    text: "Our luxury collection features the finest estates in the area. Here are three standout properties:",
    listings: mockListings,
  },
  "view featured listings": {
    text: "Here are our featured listings - these properties are getting a lot of attention! Let me know if any catch your eye:",
    listings: mockListings,
  },
  "schedule tours": {
    text: "Great idea! Let me show you our available time slots. Pick a time that works for you and I'll confirm your showing:",
    calendar: true,
  },
  default: {
    text: "Thanks for your interest! I can help you with buying, selling, scheduling showings, or getting a home valuation. What would you like to explore?",
    options: ["Buy a home", "Sell my home", "Schedule showing", "Home valuation"],
  },
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
};

export default function AIVAChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Retell state
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [retellClient, setRetellClient] = useState<RetellWebClient | null>(null);

  // Initialize Retell SDK
  useEffect(() => {
    const client = new RetellWebClient();

    client.on("call_started", () => {
      setIsCallActive(true);
      setIsConnecting(false);
    });

    client.on("call_ended", () => {
      setIsCallActive(false);
      setIsConnecting(false);
    });

    client.on("error", () => {
      setIsCallActive(false);
      setIsConnecting(false);
    });

    setRetellClient(client);

    return () => {
      client.stopCall();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startCall = async () => {
    if (!retellClient) {
      // Show error in chat
      const errorMessage: Message = {
        id: messages.length + 1,
        sender: "ai",
        text: "I'm sorry, the voice call system isn't ready yet. Please try again in a moment or use the chat instead!",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    setIsConnecting(true);

    try {
      const response = await fetch("/api/retell/web-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to start call");
      }

      await retellClient.startCall({
        accessToken: data.data.access_token,
      });

      // Add call started message
      const callMessage: Message = {
        id: messages.length + 1,
        sender: "ai",
        text: "Connected! I'm now listening. Go ahead and tell me what you're looking for, and I'll help you find the perfect property.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        callStarted: true,
      };
      setMessages((prev) => [...prev, callMessage]);
    } catch (err) {
      console.error("Error starting call:", err);
      setIsConnecting(false);

      const errorMessage: Message = {
        id: messages.length + 1,
        sender: "ai",
        text: "I couldn't start the voice call right now. This might be because voice calling isn't set up yet. Would you like to continue chatting instead?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        options: ["Yes, let's chat", "Try call again"],
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const endCall = () => {
    if (retellClient) {
      retellClient.stopCall();
    }
    setIsCallActive(false);

    const endMessage: Message = {
      id: messages.length + 1,
      sender: "ai",
      text: "Call ended. Thanks for chatting with me! Is there anything else I can help you with?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      options: ["Schedule a showing", "View listings", "Get home valuation"],
    };
    setMessages((prev) => [...prev, endMessage]);
  };

  const handleSendMessage = async (text: string) => {
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

    const lowerText = text.toLowerCase();

    // Check for special UI triggers first (listings, calendar)
    let specialResponse: { text: string; options?: string[]; listings?: typeof mockListings; calendar?: boolean } | null = null;

    // Show listings for listing-related queries
    if (lowerText.includes("show") && (lowerText.includes("listing") || lowerText.includes("home") || lowerText.includes("properties") || lowerText.includes("picks") || lowerText.includes("options"))) {
      specialResponse = { text: "Here are some properties that match what you're looking for:", listings: mockListings };
    }
    // Show calendar for scheduling queries
    else if (lowerText.includes("schedule") || lowerText.includes("showing") || lowerText.includes("tour") || lowerText.includes("appointment")) {
      specialResponse = { text: "I'd be happy to schedule a showing for you! Here are our available time slots:", calendar: true };
    }

    if (specialResponse) {
      const aiMessage: Message = {
        id: messages.length + 2,
        sender: "ai",
        text: specialResponse.text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        options: specialResponse.options,
        listings: specialResponse.listings,
        calendar: specialResponse.calendar,
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, aiMessage]);
      return;
    }

    // Try Retell AI for dynamic responses
    try {
      const response = await fetch("/api/retell/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.slice(-10).map(m => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await response.json();

      if (data.success && data.data?.response) {
        const aiMessage: Message = {
          id: messages.length + 2,
          sender: "ai",
          text: data.data.response,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setIsTyping(false);
        setMessages((prev) => [...prev, aiMessage]);
        return;
      }
    } catch (error) {
      console.error("Retell chat error:", error);
    }

    // Fallback to rule-based responses if Retell fails
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
      listings: response.listings,
      calendar: response.calendar,
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiMessage]);
  };

  const handleOptionClick = (option: string) => {
    handleSendMessage(option);
  };

  const handleTimeSelect = (date: string, time: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: `${date} at ${time}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const confirmMessage: Message = {
        id: messages.length + 2,
        sender: "ai",
        text: `Perfect! I've reserved ${date} at ${time} for your showing. You'll receive a confirmation email shortly with all the details. Is there anything else I can help you with?`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        options: ["View more listings", "Get directions", "That's all, thanks!"],
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, confirmMessage]);
    }, 1500);
  };

  const handleListingClick = (listing: typeof mockListings[0]) => {
    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: `Tell me more about ${listing.title}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const detailMessage: Message = {
        id: messages.length + 2,
        sender: "ai",
        text: `Great choice! ${listing.title} at ${listing.address} is a stunning ${listing.beds}-bedroom, ${listing.baths}-bathroom home with ${listing.sqft.toLocaleString()} sq ft of living space. Listed at ${formatPrice(listing.price)}, this property features modern amenities and is in a highly sought-after location. Would you like to schedule a showing?`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        options: ["Schedule a showing", "See similar homes", "Get more details"],
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, detailMessage]);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    if (action === "call") {
      if (isCallActive) {
        endCall();
      } else {
        startCall();
      }
    } else if (action === "schedule") {
      handleSendMessage("Schedule a showing");
    } else if (action === "listings") {
      handleSendMessage("View featured listings");
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
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
        <div className="fixed bottom-28 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col" style={{ height: "600px" }}>
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
            <button
              onClick={() => handleQuickAction("call")}
              disabled={isConnecting}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm transition-colors border ${
                isCallActive
                  ? "bg-red-100 text-red-600 border-red-200 hover:bg-red-200"
                  : isConnecting
                  ? "bg-yellow-100 text-yellow-600 border-yellow-200"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-emerald-50 hover:text-emerald-600"
              }`}
            >
              {isCallActive ? (
                <>
                  <PhoneOff className="w-4 h-4" />
                  <span>End Call</span>
                </>
              ) : isConnecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </>
              )}
            </button>
            <button
              onClick={() => handleQuickAction("schedule")}
              className="flex items-center space-x-1 px-3 py-1.5 bg-white rounded-full text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors border border-gray-200"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </button>
            <button
              onClick={() => handleQuickAction("listings")}
              className="flex items-center space-x-1 px-3 py-1.5 bg-white rounded-full text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors border border-gray-200"
            >
              <Home className="w-4 h-4" />
              <span>Listings</span>
            </button>
          </div>

          {/* Active Call Indicator */}
          {isCallActive && (
            <div className="bg-green-50 border-b border-green-100 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-5 h-5 text-green-600 animate-pulse" />
                <span className="text-sm font-medium text-green-700">Voice call active - AIVA is listening</span>
              </div>
              <button
                onClick={endCall}
                className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <PhoneOff className="w-4 h-4" />
              </button>
            </div>
          )}

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

                {/* Property Cards */}
                {message.sender === "ai" && message.listings && (
                  <div className="mt-3 ml-10 space-y-3">
                    {message.listings.map((listing) => (
                      <div
                        key={listing.id}
                        onClick={() => handleListingClick(listing)}
                        className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all"
                      >
                        <div className="flex">
                          <div className="w-24 h-24 flex-shrink-0">
                            <img
                              src={listing.image}
                              alt={listing.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm leading-tight">{listing.title}</h4>
                                <div className="flex items-center text-gray-500 text-xs mt-0.5">
                                  <MapPin className="w-3 h-3 mr-0.5" />
                                  {listing.address}
                                </div>
                              </div>
                              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                                {listing.tag}
                              </span>
                            </div>
                            <p className="text-emerald-600 font-bold text-sm mt-1">{formatPrice(listing.price)}</p>
                            <div className="flex items-center space-x-3 mt-1 text-gray-500 text-xs">
                              <span className="flex items-center">
                                <BedDouble className="w-3 h-3 mr-0.5" />
                                {listing.beds}
                              </span>
                              <span className="flex items-center">
                                <Bath className="w-3 h-3 mr-0.5" />
                                {listing.baths}
                              </span>
                              <span className="flex items-center">
                                <Square className="w-3 h-3 mr-0.5" />
                                {listing.sqft.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Calendar/Scheduling */}
                {message.sender === "ai" && message.calendar && (
                  <div className="mt-3 ml-10 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-2 mb-3">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                      <span className="font-semibold text-gray-900">Available Times</span>
                    </div>
                    <div className="space-y-3">
                      {mockTimes.map((day) => (
                        <div key={day.date}>
                          <p className="text-xs font-medium text-gray-500 mb-1.5 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {day.date}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {day.slots.map((slot) => (
                              <button
                                key={slot}
                                onClick={() => handleTimeSelect(day.date, slot)}
                                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm rounded-lg hover:bg-emerald-100 transition-colors font-medium"
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Call Started Indicator */}
                {message.sender === "ai" && message.callStarted && (
                  <div className="mt-2 ml-10 flex items-center space-x-2 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Voice call connected</span>
                  </div>
                )}

                {/* Quick Reply Options */}
                {message.sender === "ai" && message.options && !message.listings && !message.calendar && (
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
