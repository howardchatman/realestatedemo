"use client";

import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  Wrench,
  Search,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle,
  User,
  Building,
  Calendar,
} from "lucide-react";

const mockTickets = [
  { id: "tkt1", ticketNumber: "TKT-202501-0001", tenant: "Marcus Johnson", property: "456 Riverside Dr, Unit 3A", category: "plumbing", priority: "high", title: "Leaking faucet in kitchen", description: "Kitchen sink faucet is dripping constantly", status: "in_progress", createdAt: "2 hours ago", assignedTo: "Mike's Plumbing" },
  { id: "tkt2", ticketNumber: "TKT-202501-0002", tenant: "Lisa Chen", property: "789 Oakwood Lane, Unit 2B", category: "hvac", priority: "medium", title: "AC not cooling properly", description: "Air conditioning unit not maintaining temperature", status: "scheduled", createdAt: "1 day ago", assignedTo: "Cool Air HVAC", scheduledDate: "Jan 20, 2025" },
  { id: "tkt3", ticketNumber: "TKT-202501-0003", tenant: "David Williams", property: "123 Downtown Plaza, Unit 5C", category: "electrical", priority: "emergency", title: "Power outlet sparking", description: "Outlet in living room sparking when appliances plugged in", status: "open", createdAt: "30 min ago", assignedTo: null },
  { id: "tkt4", ticketNumber: "TKT-202501-0004", tenant: "Sarah Miller", property: "321 Tech Park Ave, Unit 1A", category: "appliance", priority: "low", title: "Dishwasher making noise", description: "Dishwasher making grinding noise during wash cycle", status: "completed", createdAt: "3 days ago", assignedTo: "Appliance Pros", completedAt: "Yesterday" },
  { id: "tkt5", ticketNumber: "TKT-202501-0005", tenant: "James Rodriguez", property: "555 Beachfront Blvd, Unit 4D", category: "structural", priority: "medium", title: "Crack in bathroom tile", description: "Large crack appeared in bathroom floor tile", status: "pending_parts", createdAt: "2 days ago", assignedTo: "BuildRight Contractors" },
];

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "emergency":
      return (
        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> Emergency
        </span>
      );
    case "high":
      return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">High</span>;
    case "medium":
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Medium</span>;
    case "low":
      return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">Low</span>;
    default:
      return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{priority}</span>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "open":
      return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Open</span>;
    case "in_progress":
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3" /> In Progress
        </span>
      );
    case "scheduled":
      return (
        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
          <Calendar className="w-3 h-3" /> Scheduled
        </span>
      );
    case "pending_parts":
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Pending Parts</span>;
    case "completed":
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> Completed
        </span>
      );
    default:
      return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{status}</span>;
  }
};

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    plumbing: "🔧",
    electrical: "⚡",
    hvac: "❄️",
    appliance: "🔌",
    structural: "🏠",
    pest: "🐛",
    other: "📋",
  };
  return icons[category] || "📋";
};

export default function MaintenancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch = ticket.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: mockTickets.length,
    open: mockTickets.filter(t => t.status === "open").length,
    inProgress: mockTickets.filter(t => t.status === "in_progress" || t.status === "scheduled" || t.status === "pending_parts").length,
    completed: mockTickets.filter(t => t.status === "completed").length,
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Maintenance Tickets</h1>
        <p className="text-gray-500 mt-1">Manage property maintenance requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Tickets</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.open}</p>
              <p className="text-sm text-gray-500">Open</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              <p className="text-sm text-gray-500">In Progress</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
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
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="scheduled">Scheduled</option>
              <option value="pending_parts">Pending Parts</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Priority</option>
              <option value="emergency">Emergency</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
              <Plus className="w-4 h-4" />
              <span>New Ticket</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <div key={ticket.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{getCategoryIcon(ticket.category)}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{ticket.title}</h3>
                      {getPriorityBadge(ticket.priority)}
                      {getStatusBadge(ticket.status)}
                    </div>
                    <p className="text-sm text-gray-500 font-mono">{ticket.ticketNumber}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{ticket.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{ticket.tenant}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    <span>{ticket.property}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{ticket.createdAt}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {ticket.assignedTo && (
                  <div className="text-sm text-gray-600">
                    <span className="text-gray-400">Assigned to:</span> {ticket.assignedTo}
                  </div>
                )}
                {ticket.scheduledDate && (
                  <div className="text-sm text-purple-600 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {ticket.scheduledDate}
                  </div>
                )}
                <button className="px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
