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
  FileText,
  DollarSign,
  Wrench,
  AlertTriangle,
  Send,
  CreditCard,
  Building,
  Sparkles,
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

// Mock data for leads with user account info and temperature - Mix of residential & commercial
const mockLeads: DisplayLead[] = [
  // Hot leads - Ready to buy/invest
  { id: 1, name: "Sarah Johnson", email: "sarah.j@email.com", phone: "(555) 123-4567", source: "Chat Widget", status: "new", date: "2 hours ago", hasAccount: true, isVerified: false, financing: "pre-approved", temperature: "hot" },
  { id: 2, name: "Michael Chen", email: "m.chen@email.com", phone: "(555) 234-5678", source: "AI Voice Call", status: "contacted", date: "5 hours ago", hasAccount: true, isVerified: true, financing: "cash", temperature: "hot" },
  { id: 3, name: "Robert Martinez", email: "r.martinez@investco.com", phone: "(555) 111-2222", source: "Commercial Inquiry", status: "qualified", date: "Today", hasAccount: true, isVerified: true, financing: "cash", temperature: "hot" },
  { id: 4, name: "Jennifer Lee", email: "jlee@realestate.net", phone: "(555) 333-4444", source: "Lead Capture", status: "new", date: "3 hours ago", hasAccount: true, isVerified: false, financing: "pre-approved", temperature: "hot" },

  // Warm leads - Actively looking
  { id: 5, name: "Emily Davis", email: "emily.d@email.com", phone: "(555) 345-6789", source: "Contact Form", status: "qualified", date: "1 day ago", hasAccount: true, isVerified: false, financing: "working-with-lender", temperature: "warm" },
  { id: 6, name: "David Thompson", email: "dthompson@gmail.com", phone: "(555) 555-6666", source: "AI Voice Call", status: "contacted", date: "1 day ago", hasAccount: true, isVerified: true, financing: "pre-qualified", temperature: "warm" },
  { id: 7, name: "Lisa Anderson", email: "lisa.a@yahoo.com", phone: "(555) 777-8888", source: "Chat Widget", status: "contacted", date: "2 days ago", hasAccount: true, isVerified: false, financing: "working-with-lender", temperature: "warm" },
  { id: 8, name: "Kevin Park", email: "kpark@business.com", phone: "(555) 999-0000", source: "Commercial Inquiry", status: "qualified", date: "2 days ago", hasAccount: true, isVerified: true, financing: "business-loan", temperature: "warm" },
  { id: 9, name: "Amanda Brown", email: "a.brown@email.com", phone: "(555) 567-8901", source: "Lead Capture", status: "converted", date: "3 days ago", hasAccount: true, isVerified: true, financing: "pre-qualified", temperature: "warm" },

  // Cold leads - Exploring
  { id: 10, name: "James Wilson", email: "j.wilson@email.com", phone: "(555) 456-7890", source: "Lead Capture", status: "new", date: "3 days ago", hasAccount: true, isVerified: false, financing: "exploring", temperature: "cold" },
  { id: 11, name: "Maria Garcia", email: "mgarcia@outlook.com", phone: "(555) 222-3333", source: "Contact Form", status: "new", date: "4 days ago", hasAccount: true, isVerified: false, financing: "exploring", temperature: "cold" },
  { id: 12, name: "Thomas Wright", email: "twright@company.org", phone: "(555) 444-5555", source: "Commercial Inquiry", status: "contacted", date: "5 days ago", hasAccount: true, isVerified: false, financing: "exploring", temperature: "cold" },
  { id: 13, name: "Jessica Taylor", email: "jtaylor@mail.com", phone: "(555) 666-7777", source: "AI Voice Call", status: "new", date: "5 days ago", hasAccount: true, isVerified: false, financing: "exploring", temperature: "cold" },
  { id: 14, name: "Chris Robinson", email: "crobinson@email.net", phone: "(555) 888-9999", source: "Lead Capture", status: "contacted", date: "1 week ago", hasAccount: true, isVerified: false, financing: "exploring", temperature: "cold" },
  { id: 15, name: "Ashley Moore", email: "amoore@gmail.com", phone: "(555) 101-1111", source: "Chat Widget", status: "new", date: "1 week ago", hasAccount: true, isVerified: false, financing: "exploring", temperature: "cold" },
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

// Mock data for captured users - Mix of residential & commercial clients
const mockUsers = [
  { id: "u1", name: "Sarah Johnson", email: "sarah.j@email.com", phone: "(555) 123-4567", isVerified: false, totalInquiries: 3, lastActive: "2 hours ago", createdAt: "Today", interest: "Residential - Oakwood" },
  { id: "u2", name: "Michael Chen", email: "m.chen@email.com", phone: "(555) 234-5678", isVerified: true, totalInquiries: 5, lastActive: "5 hours ago", createdAt: "Yesterday", interest: "Residential - Downtown" },
  { id: "u3", name: "Robert Martinez", email: "r.martinez@investco.com", phone: "(555) 111-2222", isVerified: true, totalInquiries: 12, lastActive: "Today", createdAt: "3 days ago", interest: "Commercial - Warehouse" },
  { id: "u4", name: "Jennifer Lee", email: "jlee@realestate.net", phone: "(555) 333-4444", isVerified: false, totalInquiries: 2, lastActive: "3 hours ago", createdAt: "Today", interest: "Residential - Riverside" },
  { id: "u5", name: "Emily Davis", email: "emily.d@email.com", phone: "(555) 345-6789", isVerified: false, totalInquiries: 2, lastActive: "1 day ago", createdAt: "2 days ago", interest: "Residential - Pine Ridge" },
  { id: "u6", name: "David Thompson", email: "dthompson@gmail.com", phone: "(555) 555-6666", isVerified: true, totalInquiries: 4, lastActive: "1 day ago", createdAt: "3 days ago", interest: "Residential - Beachfront" },
  { id: "u7", name: "Kevin Park", email: "kpark@business.com", phone: "(555) 999-0000", isVerified: true, totalInquiries: 8, lastActive: "2 days ago", createdAt: "1 week ago", interest: "Commercial - Retail Space" },
  { id: "u8", name: "James Wilson", email: "j.wilson@email.com", phone: "(555) 456-7890", isVerified: false, totalInquiries: 1, lastActive: "3 days ago", createdAt: "4 days ago", interest: "Residential - Tech Park" },
  { id: "u9", name: "Amanda Brown", email: "a.brown@email.com", phone: "(555) 567-8901", isVerified: true, totalInquiries: 8, lastActive: "3 days ago", createdAt: "2 weeks ago", interest: "Residential - Oakwood" },
  { id: "u10", name: "Thomas Wright", email: "twright@company.org", phone: "(555) 444-5555", isVerified: false, totalInquiries: 3, lastActive: "5 days ago", createdAt: "1 week ago", interest: "Commercial - Office" },
];

// Mock data for recent calls - Mix of residential & commercial
const mockCalls = [
  { id: 1, caller: "Robert Martinez", duration: "8:42", sentiment: "positive", summary: "Interested in warehouse property in Tech Park, cash buyer, wants to schedule viewing", date: "Today, 3:45 PM" },
  { id: 2, caller: "Unknown", duration: "3:24", sentiment: "positive", summary: "Looking for 3BR under $400K in Riverside, pre-approved with lender", date: "Today, 2:30 PM" },
  { id: 3, caller: "Sarah Johnson", duration: "5:12", sentiment: "positive", summary: "Follow-up on lakefront property in Oakwood, ready to make offer", date: "Today, 11:15 AM" },
  { id: 4, caller: "Kevin Park", duration: "6:33", sentiment: "positive", summary: "Inquiring about retail space downtown, owns restaurant chain", date: "Today, 9:20 AM" },
  { id: 5, caller: "Unknown", duration: "2:18", sentiment: "neutral", summary: "First-time buyer asking about starter homes under $300K", date: "Yesterday, 4:45 PM" },
  { id: 6, caller: "Jennifer Lee", duration: "4:51", sentiment: "positive", summary: "Looking for 4BR family home in Riverside, needs good schools nearby", date: "Yesterday, 2:10 PM" },
  { id: 7, caller: "Thomas Wright", duration: "7:15", sentiment: "neutral", summary: "Exploring office space options for expanding business, 5000+ sqft needed", date: "Yesterday, 10:30 AM" },
  { id: 8, caller: "Unknown", duration: "1:45", sentiment: "neutral", summary: "General inquiry about commercial listings and investment properties", date: "2 days ago, 3:15 PM" },
];

// Mock tenants data
const mockTenants = [
  { id: "t1", name: "Marcus Johnson", email: "mjohnson@email.com", phone: "(555) 111-2222", property: "456 Riverside Dr, Unit 3A", rent: 1850, leaseEnd: "2025-08-31", status: "active" },
  { id: "t2", name: "Lisa Chen", email: "lchen@email.com", phone: "(555) 333-4444", property: "789 Oakwood Lane, Unit 2B", rent: 2100, leaseEnd: "2025-06-30", status: "active" },
  { id: "t3", name: "David Williams", email: "dwilliams@email.com", phone: "(555) 555-6666", property: "123 Downtown Plaza, Unit 5C", rent: 2450, leaseEnd: "2025-12-31", status: "active" },
  { id: "t4", name: "Sarah Miller", email: "smiller@email.com", phone: "(555) 777-8888", property: "321 Tech Park Ave, Unit 1A", rent: 1950, leaseEnd: "2025-04-30", status: "active" },
  { id: "t5", name: "James Rodriguez", email: "jrodriguez@email.com", phone: "(555) 999-0000", property: "555 Beachfront Blvd, Unit 4D", rent: 2800, leaseEnd: "2025-09-30", status: "active" },
];

// Mock invoices data
const mockInvoices = [
  { id: "inv1", invoiceNumber: "INV-202501-0001", tenant: "Marcus Johnson", property: "456 Riverside Dr, Unit 3A", description: "January 2025 Rent", amount: 1850, dueDate: "2025-01-01", status: "paid", paidDate: "2024-12-28" },
  { id: "inv2", invoiceNumber: "INV-202501-0002", tenant: "Lisa Chen", property: "789 Oakwood Lane, Unit 2B", description: "January 2025 Rent", amount: 2100, dueDate: "2025-01-01", status: "paid", paidDate: "2025-01-02" },
  { id: "inv3", invoiceNumber: "INV-202501-0003", tenant: "David Williams", property: "123 Downtown Plaza, Unit 5C", description: "January 2025 Rent", amount: 2450, dueDate: "2025-01-01", status: "overdue", paidDate: null },
  { id: "inv4", invoiceNumber: "INV-202501-0004", tenant: "Sarah Miller", property: "321 Tech Park Ave, Unit 1A", description: "January 2025 Rent", amount: 1950, dueDate: "2025-01-01", status: "paid", paidDate: "2025-01-01" },
  { id: "inv5", invoiceNumber: "INV-202501-0005", tenant: "James Rodriguez", property: "555 Beachfront Blvd, Unit 4D", description: "January 2025 Rent", amount: 2800, dueDate: "2025-01-01", status: "pending", paidDate: null },
  { id: "inv6", invoiceNumber: "INV-202502-0001", tenant: "Marcus Johnson", property: "456 Riverside Dr, Unit 3A", description: "February 2025 Rent", amount: 1850, dueDate: "2025-02-01", status: "sent", paidDate: null },
  { id: "inv7", invoiceNumber: "INV-202501-0006", tenant: "Lisa Chen", property: "789 Oakwood Lane, Unit 2B", description: "Late Fee - December", amount: 150, dueDate: "2025-01-15", status: "paid", paidDate: "2025-01-10" },
];

// Mock maintenance tickets
const mockTickets = [
  { id: "tkt1", ticketNumber: "TKT-202501-0001", tenant: "Marcus Johnson", property: "456 Riverside Dr, Unit 3A", category: "plumbing", priority: "high", title: "Leaking faucet in kitchen", status: "in_progress", createdAt: "2 hours ago", assignedTo: "Mike's Plumbing" },
  { id: "tkt2", ticketNumber: "TKT-202501-0002", tenant: "Lisa Chen", property: "789 Oakwood Lane, Unit 2B", category: "hvac", priority: "medium", title: "AC not cooling properly", status: "scheduled", createdAt: "1 day ago", assignedTo: "Cool Air HVAC" },
  { id: "tkt3", ticketNumber: "TKT-202501-0003", tenant: "David Williams", property: "123 Downtown Plaza, Unit 5C", category: "electrical", priority: "emergency", title: "Power outlet sparking", status: "open", createdAt: "30 min ago", assignedTo: null },
  { id: "tkt4", ticketNumber: "TKT-202501-0004", tenant: "Sarah Miller", property: "321 Tech Park Ave, Unit 1A", category: "appliance", priority: "low", title: "Dishwasher making noise", status: "completed", createdAt: "3 days ago", assignedTo: "Appliance Pros" },
  { id: "tkt5", ticketNumber: "TKT-202501-0005", tenant: "James Rodriguez", property: "555 Beachfront Blvd, Unit 4D", category: "structural", priority: "medium", title: "Crack in bathroom tile", status: "pending_parts", createdAt: "2 days ago", assignedTo: "BuildRight Contractors" },
];

// Mock payments data
const mockPayments = [
  { id: "pay1", tenant: "Marcus Johnson", invoice: "INV-202501-0001", amount: 1850, method: "card", date: "Dec 28, 2024", status: "completed" },
  { id: "pay2", tenant: "Lisa Chen", invoice: "INV-202501-0002", amount: 2100, method: "bank_transfer", date: "Jan 2, 2025", status: "completed" },
  { id: "pay3", tenant: "Sarah Miller", invoice: "INV-202501-0004", amount: 1950, method: "card", date: "Jan 1, 2025", status: "completed" },
  { id: "pay4", tenant: "Lisa Chen", invoice: "INV-202501-0006", amount: 150, method: "card", date: "Jan 10, 2025", status: "completed" },
  { id: "pay5", tenant: "James Rodriguez", invoice: "INV-202412-0005", amount: 2800, method: "check", date: "Dec 15, 2024", status: "completed" },
];

const sidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/demo/admin", active: true },
  { name: "Listings", icon: Home, href: "/demo/admin/listings", count: 24 },
  { name: "Leads", icon: Users, href: "/demo/admin/leads", count: 47 },
  { name: "Tenants", icon: Building, href: "/demo/admin/tenants", count: mockTenants.length },
  { name: "Invoices", icon: FileText, href: "/demo/admin/invoices", count: mockInvoices.filter(i => i.status !== 'paid').length },
  { name: "Payments", icon: DollarSign, href: "/demo/admin/payments", count: mockPayments.length },
  { name: "Maintenance", icon: Wrench, href: "/demo/admin/maintenance", count: mockTickets.filter(t => t.status !== 'completed').length },
  { name: "Messages", icon: MessageSquare, href: "/demo/admin/messages", count: 12 },
  { name: "Calls", icon: Phone, href: "/demo/admin/calls", count: 8 },
  { name: "Settings", icon: Settings, href: "/demo/admin/settings" },
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

const getInvoiceStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center"><CheckCircle className="w-3 h-3 mr-1" />Paid</span>;
    case "pending":
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Pending</span>;
    case "sent":
      return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center"><Send className="w-3 h-3 mr-1" />Sent</span>;
    case "overdue":
      return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full flex items-center"><AlertTriangle className="w-3 h-3 mr-1" />Overdue</span>;
    case "cancelled":
      return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">Cancelled</span>;
    default:
      return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{status}</span>;
  }
};

const getTicketStatusBadge = (status: string) => {
  switch (status) {
    case "open":
      return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Open</span>;
    case "in_progress":
      return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">In Progress</span>;
    case "scheduled":
      return <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center"><Calendar className="w-3 h-3 mr-1" />Scheduled</span>;
    case "pending_parts":
      return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">Pending Parts</span>;
    case "completed":
      return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center"><CheckCircle className="w-3 h-3 mr-1" />Completed</span>;
    default:
      return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{status}</span>;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "emergency":
      return <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">EMERGENCY</span>;
    case "high":
      return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">High</span>;
    case "medium":
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Medium</span>;
    case "low":
      return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">Low</span>;
    default:
      return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{priority}</span>;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "plumbing":
      return "🔧";
    case "electrical":
      return "⚡";
    case "hvac":
      return "❄️";
    case "appliance":
      return "🔌";
    case "structural":
      return "🏗️";
    case "pest":
      return "🐛";
    default:
      return "🔨";
  }
};

const getPaymentMethodIcon = (method: string) => {
  switch (method) {
    case "card":
      return <CreditCard className="w-4 h-4 text-blue-500" />;
    case "bank_transfer":
      return <Building className="w-4 h-4 text-green-500" />;
    case "check":
      return <FileText className="w-4 h-4 text-gray-500" />;
    default:
      return <DollarSign className="w-4 h-4 text-gray-500" />;
  }
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leads, setLeads] = useState<DisplayLead[]>(mockLeads);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [deletingLeadId, setDeletingLeadId] = useState<string | number | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    tenant: "",
    property: "",
    description: "",
    amount: "",
    dueDate: "",
  });

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

  // Delete a lead (database leads only)
  const handleDeleteLead = async (lead: DisplayLead) => {
    if (!lead.isFromDatabase) {
      // For mock leads, just remove from state
      setLeads(prev => prev.filter(l => l.id !== lead.id));
      return;
    }

    setDeletingLeadId(lead.id);
    try {
      const response = await fetch(`/api/leads?id=${lead.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        // Remove from state
        setLeads(prev => prev.filter(l => l.id !== lead.id));
      } else {
        console.error('Failed to delete lead:', data.error);
        alert('Failed to delete lead. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Failed to delete lead. Please try again.');
    } finally {
      setDeletingLeadId(null);
    }
  };

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
              <Link
                key={item.name}
                href={item.href}
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
              </Link>
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
                  <div key={lead.id} className="p-3 md:p-4 hover:bg-gray-50 transition-colors group">
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
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {getLeadStatusBadge(lead.status)}
                        <button
                          onClick={() => handleDeleteLead(lead)}
                          disabled={deletingLeadId === lead.id}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete lead"
                        >
                          {deletingLeadId === lead.id ? (
                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
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

          {/* Invoices Section */}
          <div className="mt-4 md:mt-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-blue-100 flex items-center justify-center">
                    <FileText className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-base md:text-lg font-bold text-gray-900">Invoices</h2>
                    <p className="text-xs md:text-sm text-gray-500">Manage rent and fee invoices</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    ${mockInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0).toLocaleString()} collected
                  </span>
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    ${mockInvoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0).toLocaleString()} overdue
                  </span>
                  <button
                    onClick={() => setShowInvoiceModal(true)}
                    className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-1.5 md:py-2 bg-blue-500 text-white rounded-lg text-xs md:text-sm font-medium hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Invoice</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Invoice Cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {mockInvoices.slice(0, 5).map((invoice) => (
                <div key={invoice.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{invoice.tenant}</p>
                      <p className="text-xs text-gray-500">{invoice.description}</p>
                      <p className="text-xs text-gray-400">{invoice.invoiceNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${invoice.amount.toLocaleString()}</p>
                      {getInvoiceStatusBadge(invoice.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Invoice Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{invoice.tenant}</p>
                        <p className="text-xs text-gray-500">{invoice.property}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{invoice.description}</td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">${invoice.amount.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{invoice.dueDate}</td>
                      <td className="px-6 py-4">{getInvoiceStatusBadge(invoice.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Send">
                            <Send className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
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

          {/* Maintenance Tickets Section */}
          <div className="mt-4 md:mt-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-orange-100 flex items-center justify-center">
                    <Wrench className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-base md:text-lg font-bold text-gray-900">Maintenance Tickets</h2>
                    <p className="text-xs md:text-sm text-gray-500">Track repair requests from tenants</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    {mockTickets.filter(t => t.priority === 'emergency').length} Emergency
                  </span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                    {mockTickets.filter(t => t.status === 'open').length} Open
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {mockTickets.filter(t => t.status === 'in_progress').length} In Progress
                  </span>
                </div>
              </div>
            </div>

            {/* Ticket Cards */}
            <div className="divide-y divide-gray-100">
              {mockTickets.map((ticket) => (
                <div key={ticket.id} className={`p-4 hover:bg-gray-50 ${ticket.priority === 'emergency' ? 'bg-red-50' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{getCategoryIcon(ticket.category)}</span>
                      <div>
                        <div className="flex items-center space-x-2 flex-wrap gap-1">
                          <p className="font-medium text-gray-900 text-sm">{ticket.title}</p>
                          {getPriorityBadge(ticket.priority)}
                          {getTicketStatusBadge(ticket.status)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{ticket.tenant} • {ticket.property}</p>
                        <p className="text-xs text-gray-400">#{ticket.ticketNumber} • {ticket.createdAt}</p>
                        {ticket.assignedTo && (
                          <p className="text-xs text-blue-600 mt-1">Assigned to: {ticket.assignedTo}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Payments Section */}
          <div className="mt-4 md:mt-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-green-100 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-base md:text-lg font-bold text-gray-900">Recent Payments</h2>
                    <p className="text-xs md:text-sm text-gray-500">Track payment history</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    ${mockPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} total
                  </span>
                  <button className="flex items-center space-x-2 px-3 py-1.5 md:py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-xs md:text-sm">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Payment List */}
            <div className="divide-y divide-gray-100">
              {mockPayments.map((payment) => (
                <div key={payment.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getPaymentMethodIcon(payment.method)}
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{payment.tenant}</p>
                        <p className="text-xs text-gray-500">{payment.invoice} • {payment.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-green-600">+${payment.amount.toLocaleString()}</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {payment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tenants Section */}
          <div className="mt-4 md:mt-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-purple-100 flex items-center justify-center">
                    <Building className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-base md:text-lg font-bold text-gray-900">Tenants</h2>
                    <p className="text-xs md:text-sm text-gray-500">Manage property tenants</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    {mockTenants.length} Active Tenants
                  </span>
                  <button className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-1.5 md:py-2 bg-purple-500 text-white rounded-lg text-xs md:text-sm font-medium hover:bg-purple-600 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Add Tenant</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tenant Cards */}
            <div className="divide-y divide-gray-100">
              {mockTenants.map((tenant) => (
                <div key={tenant.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-medium text-sm">
                        {tenant.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{tenant.name}</p>
                        <p className="text-xs text-gray-500">{tenant.property}</p>
                        <p className="text-xs text-gray-400">{tenant.email} • {tenant.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${tenant.rent.toLocaleString()}/mo</p>
                      <p className="text-xs text-gray-500">Lease ends: {tenant.leaseEnd}</p>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">{tenant.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Client Portal Link */}
          <div className="mt-4 md:mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">Tenant Portal</h3>
                <p className="text-sm text-emerald-100">Share this link with tenants to submit maintenance requests and view their invoices</p>
              </div>
              <Link
                href="/demo/portal"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>View Portal</span>
              </Link>
            </div>
          </div>

          {/* AI Listing Writer Link */}
          <div className="mt-4 md:mt-6 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">AI Listing Writer</h3>
                <p className="text-sm text-violet-100">Generate compelling property descriptions with AI in seconds</p>
              </div>
              <Link
                href="/demo/ai-writer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-violet-600 rounded-lg font-medium hover:bg-violet-50 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Open AI Writer</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Create Invoice</h3>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tenant</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={invoiceForm.tenant}
                  onChange={(e) => setInvoiceForm({...invoiceForm, tenant: e.target.value})}
                >
                  <option value="">Select tenant...</option>
                  {mockTenants.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} - {t.property}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g., February 2025 Rent"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={invoiceForm.description}
                  onChange={(e) => setInvoiceForm({...invoiceForm, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={invoiceForm.amount}
                      onChange={(e) => setInvoiceForm({...invoiceForm, amount: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={invoiceForm.dueDate}
                    onChange={(e) => setInvoiceForm({...invoiceForm, dueDate: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Invoice created! (Demo mode)');
                  setShowInvoiceModal(false);
                  setInvoiceForm({ tenant: "", property: "", description: "", amount: "", dueDate: "" });
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
              >
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
