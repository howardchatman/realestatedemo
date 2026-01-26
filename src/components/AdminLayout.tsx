"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Users,
  MessageSquare,
  Phone,
  Settings,
  Bell,
  Search,
  ArrowLeft,
  Menu,
  X,
  FileText,
  DollarSign,
  Wrench,
  Building,
  Sparkles,
} from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/demo/admin" },
  { name: "Listings", icon: Home, href: "/demo/admin/listings", count: 24 },
  { name: "Leads", icon: Users, href: "/demo/admin/leads", count: 47 },
  { name: "Tenants", icon: Building, href: "/demo/admin/tenants", count: 5 },
  { name: "Invoices", icon: FileText, href: "/demo/admin/invoices", count: 3 },
  { name: "Payments", icon: DollarSign, href: "/demo/admin/payments", count: 5 },
  { name: "Maintenance", icon: Wrench, href: "/demo/admin/maintenance", count: 4 },
  { name: "Messages", icon: MessageSquare, href: "/demo/admin/messages", count: 12 },
  { name: "Calls", icon: Phone, href: "/demo/admin/calls", count: 8 },
  { name: "Settings", icon: Settings, href: "/demo/admin/settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

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

            {sidebarItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== "/demo/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg mb-1 transition-colors ${
                    isActive
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
                      isActive ? "bg-emerald-200 text-emerald-800" : "bg-gray-100 text-gray-600"
                    }`}>
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Quick Links */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Links</p>
              <Link
                href="/demo/portal"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <Building className="w-5 h-5" />
                <span className="text-sm">Tenant Portal</span>
              </Link>
              <Link
                href="/demo/ai-writer"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <Sparkles className="w-5 h-5" />
                <span className="text-sm">AI Listing Writer</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
