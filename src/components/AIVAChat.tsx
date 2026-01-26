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
  PhoneCall,
  Loader2,
  ExternalLink,
  UserPlus,
} from "lucide-react";

interface LeadInfo {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
  time: string;
  options?: string[];
  listings?: typeof mockListings;
  calendar?: boolean;
  callStarted?: boolean;
  callbackForm?: boolean;
  callbackScheduled?: { phoneNumber: string; delayMinutes: number; lead?: LeadInfo };
}

// Mock residential listings - variety of price points
const mockListings = [
  {
    id: 1,
    title: "Starter Home with Charm",
    address: "142 Maple Lane, Riverside",
    price: 285000,
    beds: 3,
    baths: 2,
    sqft: 1450,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80",
    tag: "Great Value",
  },
  {
    id: 2,
    title: "Updated Ranch Style",
    address: "567 Cedar Court, Oakwood",
    price: 325000,
    beds: 3,
    baths: 2,
    sqft: 1650,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80",
    tag: "Move-In Ready",
  },
  {
    id: 3,
    title: "Family-Friendly Split Level",
    address: "456 Willow Drive, Riverside",
    price: 389000,
    beds: 4,
    baths: 2,
    sqft: 1800,
    image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400&q=80",
    tag: "Spacious",
  },
];

// Mock commercial listings
const mockCommercialListings = [
  {
    id: 17,
    title: "Prime Retail Space",
    address: "1000 Commerce Drive, Downtown",
    price: 750000,
    beds: 0,
    baths: 2,
    sqft: 3500,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80",
    tag: "Retail",
  },
  {
    id: 18,
    title: "Industrial Warehouse",
    address: "5500 Industrial Blvd, Tech Park",
    price: 1250000,
    beds: 0,
    baths: 2,
    sqft: 15000,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80",
    tag: "Warehouse",
  },
  {
    id: 22,
    title: "Turnkey Restaurant",
    address: "888 Oceanfront Walk, Beachfront",
    price: 950000,
    beds: 0,
    baths: 4,
    sqft: 4200,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
    tag: "Restaurant",
  },
];

// Commercial property types
const commercialTypes = [
  "Retail Space",
  "Warehouse",
  "Office Building",
  "Restaurant",
  "Multi-Family",
  "Other Commercial",
];

// Mock available times
const mockTimes = [
  { date: "Tomorrow", slots: ["10:00 AM", "2:00 PM", "4:30 PM"] },
  { date: "Wednesday", slots: ["9:00 AM", "11:30 AM", "3:00 PM"] },
  { date: "Thursday", slots: ["10:00 AM", "1:00 PM", "5:00 PM"] },
];

// Areas we cover (matching demo listings)
const demoAreas = [
  "Oakwood",
  "Downtown",
  "Riverside",
  "Tech Park",
  "Beachfront",
  "Pine Ridge",
];

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "ai",
    text: "Hi! I'm AIVA, your AI real estate assistant. I'm here 24/7 to help you with residential and commercial properties. What can I help you with?",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    options: [
      "Buy a home",
      "Commercial property",
      "Sell my property",
      "Talk to an agent",
    ],
  },
];

const aiResponses: { [key: string]: { text: string; options?: string[]; listings?: typeof mockListings; calendar?: boolean } } = {
  // Main menu
  "buy a home": {
    text: "Great! Which area are you interested in?",
    options: demoAreas,
  },
  "commercial property": {
    text: "Looking for commercial real estate! What type of property are you interested in?",
    options: commercialTypes,
  },
  "sell my property": {
    text: "I can help with that! What would you like to do first?",
    options: ["Get home valuation", "Talk to an agent"],
  },
  "talk to an agent": {
    text: "I can connect you with one of our agents. How would you prefer to be contacted?",
    options: ["Schedule a call", "Request callback now"],
  },
  "schedule a call": {
    text: "When works best for you?",
    calendar: true,
  },
  "request callback now": {
    text: "I'd be happy to have someone call you back! Please enter your phone number below:",
    options: [], // This triggers the callback form via isCallbackRequest
  },

  // Commercial property types
  "retail space": {
    text: "Here are our available retail spaces:",
    listings: mockCommercialListings,
  },
  "warehouse": {
    text: "Here are our warehouse and industrial properties:",
    listings: mockCommercialListings,
  },
  "office building": {
    text: "Here are our office buildings:",
    listings: mockCommercialListings,
  },
  "restaurant": {
    text: "Here are our restaurant properties:",
    listings: mockCommercialListings,
  },
  "multi-family": {
    text: "Here are our multi-family and apartment buildings:",
    listings: mockCommercialListings,
  },
  "other commercial": {
    text: "Here are other commercial properties including car washes, gas stations, and storage facilities:",
    listings: mockCommercialListings,
  },

  // Area selections - each leads to budget question
  "oakwood": {
    text: "Oakwood has beautiful lakefront properties! What's your budget range?",
    options: ["Under $500K", "$500K - $750K", "$750K - $1M", "$1M+"],
  },
  "downtown": {
    text: "Downtown offers luxury urban living! What's your budget range?",
    options: ["Under $500K", "$500K - $750K", "$750K - $1M", "$1M+"],
  },
  "riverside": {
    text: "Riverside has charming colonial homes! What's your budget range?",
    options: ["Under $500K", "$500K - $750K", "$750K - $1M", "$1M+"],
  },
  "tech park": {
    text: "Tech Park features modern smart homes! What's your budget range?",
    options: ["Under $500K", "$500K - $750K", "$750K - $1M", "$1M+"],
  },
  "beachfront": {
    text: "Beachfront offers stunning ocean views! What's your budget range?",
    options: ["$500K - $1M", "$1M - $1.5M", "$1.5M - $2M", "$2M+"],
  },
  "pine ridge": {
    text: "Pine Ridge has cozy mountain retreats! What's your budget range?",
    options: ["Under $400K", "$400K - $600K", "$600K - $800K", "$800K+"],
  },

  // Budget selections - lead to bedroom question
  "under $400k": {
    text: "Got it! How many bedrooms do you need?",
    options: ["2 bedrooms", "3 bedrooms", "4+ bedrooms"],
  },
  "under $500k": {
    text: "Got it! How many bedrooms do you need?",
    options: ["2 bedrooms", "3 bedrooms", "4+ bedrooms"],
  },
  "$400k - $600k": {
    text: "Great range! How many bedrooms do you need?",
    options: ["3 bedrooms", "4 bedrooms", "5+ bedrooms"],
  },
  "$500k - $750k": {
    text: "Great range! How many bedrooms do you need?",
    options: ["3 bedrooms", "4 bedrooms", "5+ bedrooms"],
  },
  "$500k - $1m": {
    text: "Nice! How many bedrooms do you need?",
    options: ["3 bedrooms", "4 bedrooms", "5+ bedrooms"],
  },
  "$600k - $800k": {
    text: "Nice! How many bedrooms do you need?",
    options: ["3 bedrooms", "4 bedrooms", "5+ bedrooms"],
  },
  "$750k - $1m": {
    text: "Excellent budget! How many bedrooms do you need?",
    options: ["4 bedrooms", "5 bedrooms", "6+ bedrooms"],
  },
  "$800k+": {
    text: "Excellent budget! How many bedrooms do you need?",
    options: ["4 bedrooms", "5 bedrooms", "6+ bedrooms"],
  },
  "$1m+": {
    text: "Luxury range! How many bedrooms do you need?",
    options: ["4 bedrooms", "5 bedrooms", "6+ bedrooms"],
  },
  "$1m - $1.5m": {
    text: "Luxury range! How many bedrooms do you need?",
    options: ["4 bedrooms", "5 bedrooms", "6+ bedrooms"],
  },
  "$1.5m - $2m": {
    text: "Premium luxury! How many bedrooms do you need?",
    options: ["5 bedrooms", "6 bedrooms", "7+ bedrooms"],
  },
  "$2m+": {
    text: "Ultra luxury! How many bedrooms do you need?",
    options: ["5 bedrooms", "6 bedrooms", "7+ bedrooms"],
  },

  // Bedroom selections - show listings
  "2 bedrooms": {
    text: "Here are some 2-bedroom homes that match your criteria:",
    listings: mockListings,
  },
  "3 bedrooms": {
    text: "Here are some 3-bedroom homes that match your criteria:",
    listings: mockListings,
  },
  "4 bedrooms": {
    text: "Here are some 4-bedroom homes that match your criteria:",
    listings: mockListings,
  },
  "4+ bedrooms": {
    text: "Here are some 4+ bedroom homes that match your criteria:",
    listings: mockListings,
  },
  "5 bedrooms": {
    text: "Here are some 5-bedroom homes that match your criteria:",
    listings: mockListings,
  },
  "5+ bedrooms": {
    text: "Here are some 5+ bedroom homes that match your criteria:",
    listings: mockListings,
  },
  "6 bedrooms": {
    text: "Here are some 6-bedroom homes that match your criteria:",
    listings: mockListings,
  },
  "6+ bedrooms": {
    text: "Here are our largest estate homes:",
    listings: mockListings,
  },
  "7+ bedrooms": {
    text: "Here are our grandest estate homes:",
    listings: mockListings,
  },

  // Valuation flow
  "get home valuation": {
    text: "Great! Which area is your property located in?",
    options: demoAreas,
  },

  // Legacy support
  "i'm looking to buy a home": {
    text: "Great! Which area are you interested in?",
    options: demoAreas,
  },
  "i want to sell my property": {
    text: "I can help with that! What would you like to do first?",
    options: ["Get home valuation", "Talk to an agent"],
  },
  "schedule a showing": {
    text: "I'd be happy to schedule a showing! When works best for you?",
    calendar: true,
  },
  "schedule tours": {
    text: "Great! When works best for you?",
    calendar: true,
  },
  "view featured listings": {
    text: "Here are our featured listings:",
    listings: mockListings,
  },
  default: {
    text: "I can help you with buying, selling, or talking to an agent. What would you like to do?",
    options: ["Buy a home", "Sell my property", "Talk to an agent"],
  },
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
};

// Generate a unique session ID for this chat session
function generateSessionId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Get or create session ID from localStorage
function getSessionId(): string {
  if (typeof window === 'undefined') return generateSessionId();

  let sessionId = localStorage.getItem('aiva_session_id');
  const sessionTimestamp = localStorage.getItem('aiva_session_timestamp');

  // Create new session if none exists or if session is older than 24 hours
  const twentyFourHours = 24 * 60 * 60 * 1000;
  if (!sessionId || !sessionTimestamp || Date.now() - parseInt(sessionTimestamp) > twentyFourHours) {
    sessionId = generateSessionId();
    localStorage.setItem('aiva_session_id', sessionId);
    localStorage.setItem('aiva_session_timestamp', Date.now().toString());
  }

  return sessionId;
}

export default function AIVAChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState<string>("");

  // Retell state
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [retellClient, setRetellClient] = useState<RetellWebClient | null>(null);

  // Callback scheduling state
  const [callbackPhone, setCallbackPhone] = useState("");
  const [callbackName, setCallbackName] = useState("");
  const [callbackEmail, setCallbackEmail] = useState("");
  const [callbackMinutes, setCallbackMinutes] = useState(5);
  const [isSchedulingCallback, setIsSchedulingCallback] = useState(false);

  // Initialize session ID on mount
  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

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
        body: JSON.stringify({ sessionId }),
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

    // Check for callback request first
    const callbackCheck = isCallbackRequest(text);
    if (callbackCheck.isCallback) {
      // Set suggested minutes if extracted from message
      if (callbackCheck.minutes) {
        setCallbackMinutes(Math.min(Math.max(callbackCheck.minutes, 1), 60));
      }

      const callbackMessage: Message = {
        id: messages.length + 2,
        sender: "ai",
        text: "I'd be happy to have someone call you back! Please enter your phone number below and select when you'd like us to call:",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        callbackForm: true,
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, callbackMessage]);
      return;
    }

    // Check for special UI triggers first (listings, calendar)
    let specialResponse: { text: string; options?: string[]; listings?: typeof mockListings; calendar?: boolean } | null = null;

    // Show listings for listing-related queries
    if (lowerText.includes("show") && (lowerText.includes("listing") || lowerText.includes("home") || lowerText.includes("properties") || lowerText.includes("picks") || lowerText.includes("options"))) {
      specialResponse = { text: "Here are some properties that match what you're looking for:", listings: mockListings };
    }
    // Show calendar for scheduling queries (but not "schedule a call" which is handled above)
    else if ((lowerText.includes("schedule") || lowerText.includes("showing") || lowerText.includes("tour") || lowerText.includes("appointment")) && !lowerText.includes("call")) {
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

    // Check local responses FIRST for guided flow
    // Priority 1: Exact match (for button clicks)
    // Priority 2: Keyword match (for typed text)
    let localResponse: { text: string; options?: string[]; listings?: typeof mockListings; calendar?: boolean } | null = null;

    // First try exact match
    if (aiResponses[lowerText] && lowerText !== "default") {
      localResponse = aiResponses[lowerText];
    }

    // If no exact match, try keyword matching for common intents
    if (!localResponse) {
      // Commercial keywords - check first since "buy" might also be in commercial queries
      if (lowerText.includes("commercial") || lowerText.includes("business") || lowerText.includes("invest")) {
        localResponse = aiResponses["commercial property"];
      } else if (lowerText.includes("warehouse") || lowerText.includes("industrial")) {
        localResponse = aiResponses["warehouse"];
      } else if (lowerText.includes("retail") || lowerText.includes("store") || lowerText.includes("shop")) {
        localResponse = aiResponses["retail space"];
      } else if (lowerText.includes("office")) {
        localResponse = aiResponses["office building"];
      } else if (lowerText.includes("restaurant") || lowerText.includes("food")) {
        localResponse = aiResponses["restaurant"];
      } else if (lowerText.includes("apartment") || lowerText.includes("multi-family") || lowerText.includes("multifamily")) {
        localResponse = aiResponses["multi-family"];
      } else if (lowerText.includes("car wash") || lowerText.includes("gas station") || lowerText.includes("storage")) {
        localResponse = aiResponses["other commercial"];
      }
      // Residential keywords
      else if (lowerText.includes("buy") || lowerText.includes("looking for a home") || lowerText.includes("find a home") || lowerText.includes("house")) {
        localResponse = aiResponses["buy a home"];
      } else if (lowerText.includes("sell")) {
        localResponse = aiResponses["sell my property"];
      } else if (lowerText.includes("agent") || lowerText.includes("talk to") || lowerText.includes("speak")) {
        localResponse = aiResponses["talk to an agent"];
      } else if (lowerText.includes("valuation") || lowerText.includes("worth") || lowerText.includes("value")) {
        localResponse = aiResponses["get home valuation"];
      }
      // Check for area names
      else if (demoAreas.some(area => lowerText.includes(area.toLowerCase()))) {
        const matchedArea = demoAreas.find(area => lowerText.includes(area.toLowerCase()));
        if (matchedArea) {
          localResponse = aiResponses[matchedArea.toLowerCase()];
        }
      }
    }

    // If we have a local response, use it (for guided button-based flow)
    if (localResponse) {
      const aiMessage: Message = {
        id: messages.length + 2,
        sender: "ai",
        text: localResponse.text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        options: localResponse.options,
        listings: localResponse.listings,
        calendar: localResponse.calendar,
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, aiMessage]);
      return;
    }

    // Try smart chat for complex questions (comparisons, market analysis, neighborhood insights)
    try {
      const smartResponse = await fetch("/api/ai/smart-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.slice(-10).map(m => ({ sender: m.sender, text: m.text })),
          sessionId,
        }),
      });

      const smartData = await smartResponse.json();

      // If it's a complex question and we got a response, use it
      if (smartData.success && smartData.data?.isComplex && smartData.data?.response) {
        const aiMessage: Message = {
          id: messages.length + 2,
          sender: "ai",
          text: smartData.data.response,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          options: ["View listings", "Schedule a showing", "Talk to an agent"],
        };
        setIsTyping(false);
        setMessages((prev) => [...prev, aiMessage]);
        return;
      }
    } catch (error) {
      console.error("Smart chat error:", error);
      // Fall through to default response
    }

    // Fallback to default response
    const response = aiResponses.default;

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

  // Check if message is requesting a callback
  const isCallbackRequest = (text: string): { isCallback: boolean; minutes?: number } => {
    const lowerText = text.toLowerCase();

    // Check for callback-related phrases
    const callbackPhrases = [
      "call me back",
      "callback",
      "call back",
      "give me a call",
      "call me in",
      "call me later",
      "schedule a call",
      "schedule callback",
      "have someone call",
      "can you call me",
      "please call me",
      "request a call",
      "want a call",
      "need a call",
    ];

    const isCallback = callbackPhrases.some(phrase => lowerText.includes(phrase));

    if (isCallback) {
      // Try to extract minutes from the message
      const minuteMatch = lowerText.match(/(\d+)\s*min/);
      const hourMatch = lowerText.match(/(\d+)\s*hour/);

      if (minuteMatch) {
        return { isCallback: true, minutes: parseInt(minuteMatch[1]) };
      } else if (hourMatch) {
        return { isCallback: true, minutes: parseInt(hourMatch[1]) * 60 };
      }

      return { isCallback: true };
    }

    return { isCallback: false };
  };

  // Schedule a callback
  const scheduleCallback = async (phoneNumber: string, delayMinutes: number, name?: string, email?: string) => {
    setIsSchedulingCallback(true);

    try {
      const response = await fetch("/api/callbacks/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          delayMinutes,
          sessionId,
          name: name || undefined,
          email: email || undefined,
          notes: `Requested via chat widget`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const leadInfo = data.data?.lead;
        const displayName = name || phoneNumber;

        const confirmMessage: Message = {
          id: messages.length + 1,
          sender: "ai",
          text: leadInfo
            ? `Thanks ${displayName}! I've scheduled a callback in ${delayMinutes} minute${delayMinutes > 1 ? 's' : ''}. You've also been added as a new lead in our system - our team can now follow up with you!`
            : `I've scheduled a callback to ${phoneNumber} in ${delayMinutes} minute${delayMinutes > 1 ? 's' : ''}. Our agent will call you shortly and can transfer you to a live specialist if needed.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          callbackScheduled: {
            phoneNumber,
            delayMinutes,
            lead: leadInfo,
          },
          options: ["View listings", "Get home valuation", "That's all, thanks!"],
        };
        setMessages((prev) => [...prev, confirmMessage]);
        setCallbackPhone("");
        setCallbackName("");
        setCallbackEmail("");
        setCallbackMinutes(5);
      } else {
        throw new Error(data.error || "Failed to schedule callback");
      }
    } catch (error) {
      console.error("Error scheduling callback:", error);
      const errorMessage: Message = {
        id: messages.length + 1,
        sender: "ai",
        text: "I'm sorry, I couldn't schedule the callback right now. Would you like to try again or speak with us through the chat instead?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        options: ["Try again", "Continue chatting"],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSchedulingCallback(false);
    }
  };

  // Handle callback form submission
  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (callbackPhone.trim().length >= 10) {
      scheduleCallback(callbackPhone, callbackMinutes, callbackName, callbackEmail);
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

                {/* Callback Scheduled Confirmation */}
                {message.sender === "ai" && message.callbackScheduled && (
                  <div className="mt-3 ml-10 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                    <div className="flex items-center space-x-2 text-emerald-700 mb-3">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Callback Scheduled!</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between text-gray-600">
                        <span>Phone:</span>
                        <span className="font-medium text-gray-900">{message.callbackScheduled.phoneNumber}</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-600">
                        <span>Call in:</span>
                        <span className="font-medium text-gray-900">{message.callbackScheduled.delayMinutes} min</span>
                      </div>
                    </div>

                    {/* Lead Created Banner */}
                    {message.callbackScheduled.lead && (
                      <div className="mt-3 pt-3 border-t border-emerald-200">
                        <div className="flex items-center space-x-2 text-emerald-700 mb-2">
                          <UserPlus className="w-4 h-4" />
                          <span className="text-xs font-semibold uppercase tracking-wide">New Lead Created</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          You&apos;ve been added as a new lead. Our team can now track and follow up with you.
                        </p>
                        <a
                          href="/demo/admin"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                          <span>View in Admin Dashboard</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Callback Scheduling Form */}
                {message.sender === "ai" && message.callbackForm && (
                  <div className="mt-3 ml-10 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-2 mb-3">
                      <PhoneCall className="w-5 h-5 text-emerald-600" />
                      <span className="font-semibold text-gray-900">Schedule a Callback</span>
                    </div>
                    <form onSubmit={handleCallbackSubmit} className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">Name</label>
                          <input
                            type="text"
                            value={callbackName}
                            onChange={(e) => setCallbackName(e.target.value)}
                            placeholder="Your name"
                            className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-200"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">Email</label>
                          <input
                            type="email"
                            value={callbackEmail}
                            onChange={(e) => setCallbackEmail(e.target.value)}
                            placeholder="you@email.com"
                            className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-200"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Phone Number <span className="text-red-500">*</span></label>
                        <input
                          type="tel"
                          value={callbackPhone}
                          onChange={(e) => setCallbackPhone(e.target.value)}
                          placeholder="(555) 123-4567"
                          className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-200"
                          required
                          minLength={10}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Call me in</label>
                        <div className="flex flex-wrap gap-2">
                          {[5, 10, 15, 30, 60].map((mins) => (
                            <button
                              key={mins}
                              type="button"
                              onClick={() => setCallbackMinutes(mins)}
                              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                callbackMinutes === mins
                                  ? "bg-emerald-500 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
                              }`}
                            >
                              {mins < 60 ? `${mins} min` : "1 hour"}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isSchedulingCallback || callbackPhone.trim().length < 10}
                        className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {isSchedulingCallback ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Scheduling...</span>
                          </>
                        ) : (
                          <>
                            <PhoneCall className="w-4 h-4" />
                            <span>Schedule Callback</span>
                          </>
                        )}
                      </button>
                      <p className="text-[10px] text-gray-400 text-center">
                        You&apos;ll be added as a lead in our system
                      </p>
                    </form>
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
