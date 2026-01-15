"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Home,
  Search,
  Bell,
  User,
  Settings,
  MessageSquare,
  Calendar,
  MapPin,
  BedDouble,
  Bath,
  Square,
  ArrowLeft,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  ChevronRight,
  Star,
  TrendingUp,
  Mail,
  Phone,
  Menu,
  X,
} from "lucide-react";

// Mock saved listings
const savedListings = [
  {
    id: 1,
    title: "Modern Lakefront Estate",
    address: "123 Lakeview Drive, Oakwood",
    price: 1250000,
    beds: 5,
    baths: 4,
    sqft: 4200,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80",
    tag: "New Listing",
    savedDate: "2 days ago",
    priceChange: null,
  },
  {
    id: 2,
    title: "Downtown Luxury Penthouse",
    address: "456 Main Street, Unit PH1",
    price: 895000,
    beds: 3,
    baths: 2,
    sqft: 2100,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80",
    tag: "Featured",
    savedDate: "5 days ago",
    priceChange: -25000,
  },
  {
    id: 3,
    title: "Charming Colonial Home",
    address: "789 Oak Street, Riverside",
    price: 675000,
    beds: 4,
    baths: 3,
    sqft: 2800,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
    tag: "Open House",
    savedDate: "1 week ago",
    priceChange: null,
  },
];

// Mock saved searches
const savedSearches = [
  { id: 1, name: "Downtown 2BR+", criteria: "Downtown • 2+ beds • $500K-$800K", newListings: 3 },
  { id: 2, name: "Lakefront Homes", criteria: "Lakefront • Any beds • $1M+", newListings: 1 },
  { id: 3, name: "Family Homes", criteria: "Suburban • 4+ beds • Good schools", newListings: 5 },
];

// Mock scheduled showings
const scheduledShowings = [
  { id: 1, property: "Modern Lakefront Estate", address: "123 Lakeview Drive", date: "Tomorrow", time: "2:00 PM", status: "confirmed" },
  { id: 2, property: "Downtown Luxury Penthouse", address: "456 Main Street", date: "Thursday", time: "10:00 AM", status: "pending" },
];

// Mock recent activity
const recentActivity = [
  { id: 1, type: "view", message: "You viewed Modern Lakefront Estate", time: "2 hours ago" },
  { id: 2, type: "save", message: "You saved Downtown Luxury Penthouse", time: "5 hours ago" },
  { id: 3, type: "inquiry", message: "Your inquiry was sent to Chatman Real Estate", time: "1 day ago" },
  { id: 4, type: "showing", message: "Showing confirmed for 123 Lakeview Drive", time: "2 days ago" },
];

const sidebarItems = [
  { name: "Dashboard", icon: Home, active: true },
  { name: "Saved Homes", icon: Heart, count: 3 },
  { name: "Saved Searches", icon: Search, count: 3 },
  { name: "Showings", icon: Calendar, count: 2 },
  { name: "Messages", icon: MessageSquare, count: 1 },
  { name: "Notifications", icon: Bell, count: 5 },
  { name: "Profile", icon: User },
  { name: "Settings", icon: Settings },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
};

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("saved");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <h1 className="text-lg md:text-xl font-bold text-gray-900">My Dashboard</h1>
            <span className="hidden sm:inline px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">Demo</span>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button className="hidden sm:block p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative">
              <MessageSquare className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full text-white text-xs flex items-center justify-center">1</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold">
                SJ
              </div>
              <div className="hidden md:block">
                <p className="font-medium text-gray-900 text-sm">Sarah Johnson</p>
                <p className="text-xs text-gray-500">Premium Member</p>
              </div>
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

            {/* User Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 mb-6 text-white">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                  SJ
                </div>
                <div>
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-sm text-white/80">Member since 2024</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>Premium Account</span>
              </div>
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
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 md:p-6 mb-6 md:mb-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-2">Welcome back, Sarah!</h2>
                <p className="text-white/80 text-sm md:text-base">You have 3 saved homes and 2 upcoming showings</p>
              </div>
              <Link
                href="/listings"
                className="px-4 md:px-6 py-2 md:py-3 bg-white text-emerald-600 rounded-xl font-semibold hover:shadow-lg transition-all text-center text-sm md:text-base"
              >
                Browse Listings
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                  <p className="text-sm text-gray-500">Saved Homes</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Search className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                  <p className="text-sm text-gray-500">Saved Searches</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                  <p className="text-sm text-gray-500">Showings</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                  <p className="text-sm text-gray-500">Properties Viewed</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Saved Homes */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 md:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-base md:text-lg font-bold text-gray-900">Saved Homes</h2>
                  <button className="text-emerald-600 text-sm font-medium hover:text-emerald-700 flex items-center">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {savedListings.map((listing) => (
                  <div key={listing.id} className="p-3 md:p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-3 md:space-x-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover"
                        />
                        <span className="absolute top-1 left-1 md:top-2 md:left-2 px-1.5 md:px-2 py-0.5 bg-emerald-500 text-white text-[10px] md:text-xs font-medium rounded-full">
                          {listing.tag}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">{listing.title}</h3>
                            <div className="flex items-center text-gray-500 text-xs md:text-sm mt-1">
                              <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{listing.address}</span>
                            </div>
                          </div>
                          <button className="p-1.5 md:p-2 text-red-500 hover:bg-red-50 rounded-lg flex-shrink-0">
                            <Heart className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                          </button>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 md:mt-3 gap-2">
                          <div>
                            <p className="text-base md:text-lg font-bold text-emerald-600">{formatPrice(listing.price)}</p>
                            {listing.priceChange && (
                              <p className="text-[10px] md:text-xs text-green-600 flex items-center">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Price dropped {formatPrice(Math.abs(listing.priceChange))}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-3 md:space-x-4 text-gray-500 text-xs md:text-sm">
                            <span className="flex items-center">
                              <BedDouble className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                              {listing.beds}
                            </span>
                            <span className="flex items-center">
                              <Bath className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                              {listing.baths}
                            </span>
                            <span className="flex items-center">
                              <Square className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                              {listing.sqft.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Upcoming Showings */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900">Upcoming Showings</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {scheduledShowings.map((showing) => (
                    <div key={showing.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{showing.property}</p>
                          <p className="text-sm text-gray-500">{showing.address}</p>
                        </div>
                        {showing.status === "confirmed" ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Confirmed
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 mt-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          {showing.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {showing.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Saved Searches */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900">Saved Searches</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {savedSearches.map((search) => (
                    <div key={search.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{search.name}</p>
                          <p className="text-sm text-gray-500">{search.criteria}</p>
                        </div>
                        {search.newListings > 0 && (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                            {search.newListings} new
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900">Recent Activity</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === "view" ? "bg-blue-100" :
                          activity.type === "save" ? "bg-red-100" :
                          activity.type === "inquiry" ? "bg-purple-100" :
                          "bg-green-100"
                        }`}>
                          {activity.type === "view" && <Eye className="w-4 h-4 text-blue-600" />}
                          {activity.type === "save" && <Heart className="w-4 h-4 text-red-500" />}
                          {activity.type === "inquiry" && <MessageSquare className="w-4 h-4 text-purple-600" />}
                          {activity.type === "showing" && <Calendar className="w-4 h-4 text-green-600" />}
                        </div>
                        <div>
                          <p className="text-sm text-gray-800">{activity.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Agent Card */}
          <div className="mt-4 md:mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-lg md:text-xl font-bold flex-shrink-0">
                  JC
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm md:text-base">Your Agent: Jessica Chen</p>
                  <p className="text-xs md:text-sm text-gray-500">Senior Real Estate Advisor</p>
                  <div className="flex items-center space-x-3 md:space-x-4 mt-1 md:mt-2">
                    <a href="tel:+18327707998" className="flex items-center text-xs md:text-sm text-emerald-600 hover:text-emerald-700">
                      <Phone className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      <span className="hidden sm:inline">(832) 770-7998</span>
                      <span className="sm:hidden">Call</span>
                    </a>
                    <a href="mailto:jessica@chatmanrealestate.com" className="flex items-center text-xs md:text-sm text-emerald-600 hover:text-emerald-700">
                      <Mail className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      Email
                    </a>
                  </div>
                </div>
              </div>
              <button className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors text-sm md:text-base">
                Schedule a Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
