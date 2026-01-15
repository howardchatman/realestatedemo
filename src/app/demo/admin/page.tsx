"use client";

import { useState } from "react";
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

// Mock data for leads
const mockLeads = [
  { id: 1, name: "Sarah Johnson", email: "sarah.j@email.com", phone: "(555) 123-4567", source: "Web Chat", status: "new", date: "2 hours ago" },
  { id: 2, name: "Michael Chen", email: "m.chen@email.com", phone: "(555) 234-5678", source: "Phone Call", status: "contacted", date: "5 hours ago" },
  { id: 3, name: "Emily Davis", email: "emily.d@email.com", phone: "(555) 345-6789", source: "Contact Form", status: "qualified", date: "1 day ago" },
  { id: 4, name: "James Wilson", email: "j.wilson@email.com", phone: "(555) 456-7890", source: "Home Valuation", status: "new", date: "1 day ago" },
  { id: 5, name: "Amanda Brown", email: "a.brown@email.com", phone: "(555) 567-8901", source: "Web Chat", status: "converted", date: "2 days ago" },
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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Site</span>
            </Link>
            <div className="h-6 w-px bg-gray-200" />
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">Demo</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
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

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <div className="p-4">
            {sidebarItems.map((item) => (
              <button
                key={item.name}
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
        <div className="flex-1 p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Home className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="text-emerald-600 text-sm font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" /> +12%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">24</h3>
              <p className="text-gray-500 text-sm">Active Listings</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-emerald-600 text-sm font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" /> +28%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">47</h3>
              <p className="text-gray-500 text-sm">New Leads This Week</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-emerald-600 text-sm font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" /> +45%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">156</h3>
              <p className="text-gray-500 text-sm">AI Calls Handled</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-emerald-600 text-sm font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" /> +8%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">12</h3>
              <p className="text-gray-500 text-sm">Showings Scheduled</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Listings Table */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Property Listings</h2>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm">
                      <Filter className="w-4 h-4" />
                      <span>Filter</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">
                      <Plus className="w-4 h-4" />
                      <span>Add Listing</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
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
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Recent Leads</h2>
                  <button className="text-emerald-600 text-sm font-medium hover:text-emerald-700">View All</button>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {mockLeads.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 font-medium text-sm">
                          {lead.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{lead.name}</p>
                          <p className="text-xs text-gray-500">{lead.source} • {lead.date}</p>
                        </div>
                      </div>
                      {getLeadStatusBadge(lead.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent AI Calls */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Recent AI Calls</h2>
                    <p className="text-sm text-gray-500">Calls handled by AIVA</p>
                  </div>
                </div>
                <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {mockCalls.map((call) => (
                <div key={call.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{call.caller}</p>
                        <p className="text-sm text-gray-500">{call.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">{call.duration}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        call.sentiment === "positive" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}>
                        {call.sentiment}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 ml-14">{call.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
