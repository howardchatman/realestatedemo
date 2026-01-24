"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Home,
  Users,
  MessageSquare,
  Phone,
  Calendar,
  TrendingUp,
  Settings,
  Bell,
  Search,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
  ChevronDown,
  Download,
  Filter,
  Menu,
  X,
} from "lucide-react";

// Mock data for listings
const mockListings = [
  {
    id: 1,
    title: "Modern Lakefront Estate",
    address: "123 Lakeview Drive, Oakwood",
    price: 1250000,
    status: "active",
    views: 1240,
    inquiries: 23,
    daysOnMarket: 12,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=200&q=80",
  },
  {
    id: 2,
    title: "Downtown Luxury Penthouse",
    address: "456 Main Street, Unit PH1",
    price: 895000,
    status: "pending",
    views: 890,
    inquiries: 15,
    daysOnMarket: 8,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&q=80",
  },
  {
    id: 3,
    title: "Charming Colonial Home",
    address: "789 Oak Street, Riverside",
    price: 675000,
    status: "active",
    views: 650,
    inquiries: 11,
    daysOnMarket: 21,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&q=80",
  },
  {
    id: 4,
    title: "Contemporary Smart Home",
    address: "321 Tech Park Lane",
    price: 785000,
    status: "sold",
    views: 1100,
    inquiries: 28,
    daysOnMarket: 15,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200&q=80",
  },
];

// Type for database leads
interface DbLead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  source: string;
  status: string;
  preferred_contact: string;
  created_at: string;
  updated_at: string;
}

// Type for display leads (combines mock and real)
interface DisplayLead {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  date: string;
  hasAccount: boolean;
  isVerified: boolean;
  financing: string;
  temperature: string;
  isFromDatabase?: boolean;
}

// Mock data for leads with user account info and temperature
const mockLeads: DisplayLead[] = [
  { id: 1, name: "Sarah Johnson", email: "sarah.j@email.com", phone: "(555) 123-4567", source: "Lead Capture", status: "new", date: "2 hours ago", hasAccount: true, isVerified: false, financing: "pre-approved", temperature: "hot" },
  { id: 2, name: "Michael Chen", email: "m.chen@email.com", phone: "(555) 234-5678", source: "Phone Call", status: "contacted", date: "5 hours ago", hasAccount: true, isVerified: true, financing: "cash", temperature: "hot" },
  { id: 3, name: "Emily Davis", email: "emily.d@email.com", phone: "(555) 345-6789", source: "Contact Form", status: "qualified", date: "1 day ago", hasAccount: true, isVerified: false, financing: "working-with-lender", temperature: "warm" },
  { id: 4, name: "James Wilson", email: "j.wilson@email.com", phone: "(555) 456-7890", source: "Lead Capture", status: "new", date: "1 day ago", hasAccount: true, isVerified: false, financing: "exploring", temperature: "cold" },
  { id: 5, name: "Amanda Brown", email: "a.brown@email.com", phone: "(555) 567-8901", source: "Lead Capture", status: "converted", date: "2 days ago", hasAccount: true, isVerified: true, financing: "pre-qualified", temperature: "warm" },
];

// Helper to format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

// Convert database lead to display format
function dbLeadToDisplay(lead: DbLead): DisplayLead {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone || "Not provided",
    source: lead.source === 'chat' ? 'Chat Widget' : lead.source === 'contact_form' ? 'Contact Form' : lead.source,
    status: lead.status,
    date: formatRelativeTime(lead.created_at),
    hasAccount: true,
    isVerified: false,
    financing: "exploring",
    temperature: lead.status === 'new' ? 'hot' : lead.status === 'contacted' ? 'warm' : 'cold',
    isFromDatabase: true,
  };
}

// Mock data for captured users
const mockUsers = [
  { id: "u1", name: "Sarah Johnson", email: "sarah.j@email.com", phone: "(555) 123-4567", isVerified: false, totalInquiries: 3, lastActive: "2 hours ago", createdAt: "Today" },
  { id: "u2", name: "Michael Chen", email: "m.chen@email.com", phone: "(555) 234-5678", isVerified: true, totalInquiries: 5, lastActive: "5 hours ago", createdAt: "Yesterday" },
  { id: "u3", name: "Emily Davis", email: "emily.d@email.com", phone: "(555) 345-6789", isVerified: false, totalInquiries: 2, lastActive: "1 day ago", createdAt: "2 days ago" },
  { id: "u4", name: "James Wilson", email: "j.wilson@email.com", phone: "(555) 456-7890", isVerified: false, totalInquiries: 1, lastActive: "1 day ago", createdAt: "3 days ago" },
  { id: "u5", name: "Amanda Brown", email: "a.brown@email.com", phone: "(555) 567-8901", isVerified: true, totalInquiries: 8, lastActive: "2 days ago", createdAt: "1 week ago" },
];

// Mock data for recent calls
const mockCalls = [
  { id: 1, caller: "Unknown", duration: "3:24", sentiment: "positive", summary: "Looking for 3BR in downtown", date: "Today, 2:30 PM" },
  { id: 2, caller: "Sarah Johnson", duration: "5:12", sentiment: "positive", summary: "Interested in lakefront property", date: "Today, 11:15 AM" },
  { id: 3, caller: "Unknown", duration: "1:45", sentiment: "neutral", summary: "General inquiry about listings", date: "Yesterday, 4:45 PM" },
];

const sidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard, active: true },
  { name: "Listings", icon: Home, count: 24 },
  { name: "Leads", icon: Users, count: 47 },
  { name: "Users", icon: Users, count: mockUsers.length, highlight: true },
  { name: "Messages", icon: MessageSquare, count: 12 },
  { name: "Calls", icon: Phone, count: 8 },
  { name: "Showings", icon: Calendar, count: 5 },
  { name: "Analytics", icon: TrendingUp },
  { name: "Settings", icon: Settings },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Active</span>;
    case "pending":
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Pending</span>;
    case "sold":
      return <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">Sold</span>;
    default:
      return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{status}</span>;
  }
};

const getLeadStatusBadge = (status: string) => {
  switch (status) {
    case "new":
      return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center"><Clock className="w-3 h-3 mr-1" />New</span>;
    case "contacted":
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Contacted</span>;
    case "qualified":
      return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Qualified</span>;
    case "converted":
      return <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center"><CheckCircle className="w-3 h-3 mr-1" />Converted</span>;
    default:
      return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{status}</span>;
  }
};

const getTemperatureBadge = (temperature: string) => {
  switch (temperature) {
    case "hot":
      return (
        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center">
          🔥 Hot
        </span>
      );
    case "warm":
      return (
        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full flex items-center">
          🌡️ Warm
        </span>
      );
    case "cold":
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full flex items-center">
          ❄️ Cold
        </span>
      );
    default:
      return null;
  }
};

const getFinancingLabel = (financing: string) => {
  switch (financing) {
    case "pre-approved":
      return "Pre-approved";
    case "pre-qualified":
      return "Pre-qualified";
    case "working-with-lender":
      return "Working with lender";
    case "exploring":
      return "Exploring options";
    case "cash":
      return "Cash buyer";
    default:
      return financing;
  }
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leads, setLeads] = useState<DisplayLead[]>(mockLeads);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);

  // Fetch real leads from database
  useEffect(() => {
    async function fetchLeads() {
      try {
        const response = await fetch('/api/leads?limit=20');
        const data = await response.json();

        if (data.success && data.data && data.data.length > 0) {
          // Convert database leads to display format and prepend to mock leads
          const dbLeads = data.data.map((lead: DbLead) => dbLeadToDisplay(lead));
          // Put real leads first, then mock leads
          setLeads([...dbLeads, ...mockLeads]);
        }
      } catch (error) {
        console.error('Error fetching leads:', error);
        // Keep mock leads on error
      } finally {
        setIsLoadingLeads(false);
      }
    }

    fetchLeads();
    // Poll for new leads every 10 seconds
    const interval = setInterval(fetchLeads, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Hamburger Menu - Mobile Only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Site</span>
            </Link>
            <div className="hidden sm:block h-6 w-px bg-gray-200" />
            <h1 className="text-lg md:text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <span className="hidden sm:inline px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">Demo</span>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="relative hidden md:block">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48 lg:w-64"
              />
            </div>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold">
              JD
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar - Desktop: always visible, Mobile: slide-in drawer */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 lg:w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:transform-none lg:min-h-[calc(100vh-73px)]
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4 h-full overflow-y-auto">
            {/* Close button - Mobile Only */}
            <div className="flex items-center justify-between lg:hidden mb-4">
              <h2 className="font-bold text-gray-900">Menu</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {sidebarItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg mb-1 transition-colors ${
                  item.active
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </div>
                {item.count && (
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    item.active ? "bg-emerald-200 text-emerald-800" : "bg-gray-100 text-gray-600"
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            <div className="bg-white rounded-xl p-3 md:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Home className="w-4 h-4 md:w-6 md:h-6 text-emerald-600" />
                </div>
                <span className="text-emerald-600 text-xs md:text-sm font-medium flex items-center">
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-0.5 md:mr-1" /> +12%
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">24</h3>
              <p className="text-gray-500 text-xs md:text-sm">Active Listings</p>
            </div>

            <div className="bg-white rounded-xl p-3 md:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-blue-100 flex items-center justify-center">
                  <Users className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
                </div>
                <span className="text-emerald-600 text-xs md:text-sm font-medium flex items-center">
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-0.5 md:mr-1" /> +{leads.filter(l => l.isFromDatabase).length > 0 ? 'NEW' : '28%'}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">{leads.length}</h3>
              <p className="text-gray-500 text-xs md:text-sm">Total Leads</p>
            </div>

            <div className="bg-white rounded-xl p-3 md:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-purple-100 flex items-center justify-center">
                  <Phone className="w-4 h-4 md:w-6 md:h-6 text-purple-600" />
                </div>
                <span className="text-emerald-600 text-xs md:text-sm font-medium flex items-center">
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-0.5 md:mr-1" /> +45%
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">156</h3>
              <p className="text-gray-500 text-xs md:text-sm">AI Calls</p>
            </div>

            <div className="bg-white rounded-xl p-3 md:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-orange-100 flex items-center justify-center">
                  <Calendar className="w-4 h-4 md:w-6 md:h-6 text-orange-600" />
                </div>
                <span className="text-emerald-600 text-xs md:text-sm font-medium flex items-center">
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-0.5 md:mr-1" /> +8%
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">12</h3>
              <p className="text-gray-500 text-xs md:text-sm">Showings</p>
            </div>
          </div>

          {/* Lead Temperature Breakdown */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 mb-6 md:mb-8">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">Lead Temperature</h3>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-3 md:p-4 border border-red-100">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl md:text-2xl">🔥</span>
                  <span className="font-bold text-red-700 text-sm md:text-base">Hot</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">12</p>
                <p className="text-[10px] md:text-xs text-gray-500 mt-1">Pre-approved & Cash</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-3 md:p-4 border border-orange-100">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl md:text-2xl">🌡️</span>
                  <span className="font-bold text-orange-700 text-sm md:text-base">Warm</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">18</p>
                <p className="text-[10px] md:text-xs text-gray-500 mt-1">Working with lenders</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 md:p-4 border border-blue-100">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl md:text-2xl">❄️</span>
                  <span className="font-bold text-blue-700 text-sm md:text-base">Cold</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">17</p>
                <p className="text-[10px] md:text-xs text-gray-500 mt-1">Exploring options</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Listings Table */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 md:p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h2 className="text-base md:text-lg font-bold text-gray-900">Property Listings</h2>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1.5 md:py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-xs md:text-sm">
                      <Filter className="w-4 h-4" />
                      <span>Filter</span>
                    </button>
                    <button className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-1.5 md:py-2 bg-emerald-500 text-white rounded-lg text-xs md:text-sm font-medium hover:bg-emerald-600 transition-colors">
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-100">
                {mockListings.map((listing) => (
                  <div key={listing.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <img src={listing.image} alt={listing.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">{listing.title}</p>
                            <p className="text-xs text-gray-500 truncate">{listing.address}</p>
                          </div>
                          {getStatusBadge(listing.status)}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-semibold text-gray-900 text-sm">{formatPrice(listing.price)}</span>
                          <div className="flex items-center space-x-1 text-gray-500 text-xs">
                            <Eye className="w-3 h-3" />
                            <span>{listing.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockListings.map((listing) => (
                      <tr key={listing.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img src={listing.image} alt={listing.title} className="w-12 h-12 rounded-lg object-cover" />
                            <div>
                              <p className="font-medium text-gray-900">{listing.title}</p>
                              <p className="text-sm text-gray-500">{listing.address}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">{formatPrice(listing.price)}</span>
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(listing.status)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-1 text-gray-600">
                            <Eye className="w-4 h-4" />
                            <span>{listing.views}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Leads */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 md:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base md:text-lg font-bold text-gray-900">Recent Leads</h2>
                    {isLoadingLeads && (
                      <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                  <button className="text-emerald-600 text-xs md:text-sm font-medium hover:text-emerald-700">View All</button>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {leads.slice(0, 7).map((lead) => (
                  <div key={lead.id} className="p-3 md:p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2 md:space-x-3 min-w-0">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-medium text-xs md:text-sm flex-shrink-0 ${
                          lead.temperature === "hot"
                            ? "bg-gradient-to-br from-red-400 to-orange-500 text-white"
                            : lead.temperature === "warm"
                            ? "bg-gradient-to-br from-orange-300 to-yellow-400 text-white"
                            : "bg-gradient-to-br from-blue-300 to-cyan-400 text-white"
                        }`}>
                          {lead.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2 flex-wrap gap-1">
                            <p className="font-medium text-gray-900 text-sm truncate">{lead.name}</p>
                            {lead.isFromDatabase && (
                              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-semibold rounded">NEW</span>
                            )}
                            {getTemperatureBadge(lead.temperature)}
                          </div>
                          <p className="text-[10px] md:text-xs text-gray-500 truncate">
                            {lead.isFromDatabase ? lead.source : getFinancingLabel(lead.financing)} • {lead.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">{getLeadStatusBadge(lead.status)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent AI Calls */}
          <div className="mt-4 md:mt-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-purple-100 flex items-center justify-center">
                    <Phone className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-base md:text-lg font-bold text-gray-900">Recent AI Calls</h2>
                    <p className="text-xs md:text-sm text-gray-500">Calls handled by AIVA</p>
                  </div>
                </div>
                <button className="flex items-center space-x-2 px-3 py-1.5 md:py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-xs md:text-sm self-start sm:self-auto">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {mockCalls.map((call) => (
                <div key={call.id} className="p-3 md:p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start md:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 md:space-x-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{call.caller}</p>
                        <p className="text-xs text-gray-500">{call.date}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                      <span className="text-xs md:text-sm text-gray-600">{call.duration}</span>
                      <span className={`px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full ${
                        call.sentiment === "positive" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}>
                        {call.sentiment}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs md:text-sm text-gray-600 ml-10 md:ml-14">{call.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Captured Users / Accounts */}
          <div className="mt-4 md:mt-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Users className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-base md:text-lg font-bold text-gray-900">Captured Users</h2>
                    <p className="text-xs md:text-sm text-gray-500">User accounts from lead capture</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                    {mockUsers.length} Total Users
                  </span>
                  <button className="flex items-center space-x-2 px-3 py-1.5 md:py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-xs md:text-sm self-start sm:self-auto">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-100">
              {mockUsers.map((user) => (
                <div key={user.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-medium text-sm">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                          {user.isVerified && (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">{user.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium text-emerald-600">{user.totalInquiries} inquiries</span>
                      <p className="text-[10px] text-gray-400">Joined {user.createdAt}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inquiries</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-medium">
                            {user.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-gray-900">{user.name}</p>
                              {user.isVerified && (
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500">Last active: {user.lastActive}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{user.email}</p>
                        <p className="text-xs text-gray-500">{user.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        {user.isVerified ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center w-fit">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">{user.totalInquiries}</span>
                        <span className="text-xs text-gray-500 ml-1">total</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.createdAt}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                            <Phone className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
