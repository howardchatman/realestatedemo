"use client";

import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  Clock,
  Trash2,
  MoreVertical,
  TrendingUp,
} from "lucide-react";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  date: string;
  financing: string;
  temperature: string;
}

const mockLeads: Lead[] = [
  { id: 1, name: "Sarah Johnson", email: "sarah.j@email.com", phone: "(555) 123-4567", source: "Chat Widget", status: "new", date: "2 hours ago", financing: "pre-approved", temperature: "hot" },
  { id: 2, name: "Michael Chen", email: "m.chen@email.com", phone: "(555) 234-5678", source: "AI Voice Call", status: "contacted", date: "5 hours ago", financing: "cash", temperature: "hot" },
  { id: 3, name: "Robert Martinez", email: "r.martinez@investco.com", phone: "(555) 111-2222", source: "Commercial Inquiry", status: "qualified", date: "Today", financing: "cash", temperature: "hot" },
  { id: 4, name: "Jennifer Lee", email: "jlee@realestate.net", phone: "(555) 333-4444", source: "Lead Capture", status: "new", date: "3 hours ago", financing: "pre-approved", temperature: "hot" },
  { id: 5, name: "Emily Davis", email: "emily.d@email.com", phone: "(555) 345-6789", source: "Contact Form", status: "qualified", date: "1 day ago", financing: "working-with-lender", temperature: "warm" },
  { id: 6, name: "David Thompson", email: "dthompson@gmail.com", phone: "(555) 555-6666", source: "AI Voice Call", status: "contacted", date: "1 day ago", financing: "pre-qualified", temperature: "warm" },
  { id: 7, name: "Lisa Anderson", email: "lisa.a@yahoo.com", phone: "(555) 777-8888", source: "Chat Widget", status: "contacted", date: "2 days ago", financing: "working-with-lender", temperature: "warm" },
  { id: 8, name: "Kevin Park", email: "kpark@business.com", phone: "(555) 999-0000", source: "Commercial Inquiry", status: "qualified", date: "2 days ago", financing: "business-loan", temperature: "warm" },
  { id: 9, name: "Amanda Brown", email: "a.brown@email.com", phone: "(555) 567-8901", source: "Lead Capture", status: "converted", date: "3 days ago", financing: "pre-qualified", temperature: "warm" },
  { id: 10, name: "James Wilson", email: "j.wilson@email.com", phone: "(555) 456-7890", source: "Lead Capture", status: "new", date: "3 days ago", financing: "exploring", temperature: "cold" },
  { id: 11, name: "Maria Garcia", email: "mgarcia@outlook.com", phone: "(555) 222-3333", source: "Contact Form", status: "new", date: "4 days ago", financing: "exploring", temperature: "cold" },
  { id: 12, name: "Thomas Wright", email: "twright@company.org", phone: "(555) 444-5555", source: "Commercial Inquiry", status: "contacted", date: "5 days ago", financing: "exploring", temperature: "cold" },
];

const getStatusBadge = (status: string) => {
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
      return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">🔥 Hot</span>;
    case "warm":
      return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">🌡️ Warm</span>;
    case "cold":
      return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">❄️ Cold</span>;
    default:
      return null;
  }
};

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [temperatureFilter, setTemperatureFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredLeads = mockLeads.filter((lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTemp = temperatureFilter === "all" || lead.temperature === temperatureFilter;
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesTemp && matchesStatus;
  });

  const stats = {
    total: mockLeads.length,
    hot: mockLeads.filter(l => l.temperature === "hot").length,
    warm: mockLeads.filter(l => l.temperature === "warm").length,
    cold: mockLeads.filter(l => l.temperature === "cold").length,
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
        <p className="text-gray-500 mt-1">Track and manage your leads by temperature</p>
      </div>

      {/* Temperature Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Leads</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-700">{stats.hot}</p>
              <p className="text-sm text-red-600">🔥 Hot Leads</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-orange-700">{stats.warm}</p>
              <p className="text-sm text-orange-600">🌡️ Warm Leads</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-700">{stats.cold}</p>
              <p className="text-sm text-blue-600">❄️ Cold Leads</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
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
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={temperatureFilter}
              onChange={(e) => setTemperatureFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Temperatures</option>
              <option value="hot">🔥 Hot</option>
              <option value="warm">🌡️ Warm</option>
              <option value="cold">❄️ Cold</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Temperature</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Financing</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{lead.name}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {lead.phone}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getTemperatureBadge(lead.temperature)}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{lead.source}</span>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(lead.status)}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 capitalize">{lead.financing.replace("-", " ")}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{lead.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Call">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Email">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg" title="Message">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
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
    </AdminLayout>
  );
}
