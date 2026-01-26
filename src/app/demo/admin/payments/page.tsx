"use client";

import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  DollarSign,
  Search,
  CreditCard,
  Building2,
  CheckCircle,
  TrendingUp,
  Download,
  Eye,
  Calendar,
} from "lucide-react";

const mockPayments = [
  { id: "pay1", tenant: "Marcus Johnson", invoice: "INV-202501-0001", amount: 1850, method: "card", date: "Dec 28, 2024", status: "completed", property: "456 Riverside Dr, Unit 3A" },
  { id: "pay2", tenant: "Lisa Chen", invoice: "INV-202501-0002", amount: 2100, method: "bank_transfer", date: "Jan 2, 2025", status: "completed", property: "789 Oakwood Lane, Unit 2B" },
  { id: "pay3", tenant: "Sarah Miller", invoice: "INV-202501-0004", amount: 1950, method: "card", date: "Jan 1, 2025", status: "completed", property: "321 Tech Park Ave, Unit 1A" },
  { id: "pay4", tenant: "Lisa Chen", invoice: "INV-202501-0006", amount: 150, method: "card", date: "Jan 10, 2025", status: "completed", property: "789 Oakwood Lane, Unit 2B" },
  { id: "pay5", tenant: "James Rodriguez", invoice: "INV-202412-0005", amount: 2800, method: "check", date: "Dec 15, 2024", status: "completed", property: "555 Beachfront Blvd, Unit 4D" },
  { id: "pay6", tenant: "David Williams", invoice: "INV-202412-0003", amount: 2450, method: "bank_transfer", date: "Dec 1, 2024", status: "completed", property: "123 Downtown Plaza, Unit 5C" },
  { id: "pay7", tenant: "Marcus Johnson", invoice: "INV-202412-0001", amount: 1850, method: "card", date: "Nov 28, 2024", status: "completed", property: "456 Riverside Dr, Unit 3A" },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

const getMethodIcon = (method: string) => {
  switch (method) {
    case "card":
      return <CreditCard className="w-4 h-4 text-blue-600" />;
    case "bank_transfer":
      return <Building2 className="w-4 h-4 text-emerald-600" />;
    case "check":
      return <DollarSign className="w-4 h-4 text-purple-600" />;
    default:
      return <DollarSign className="w-4 h-4 text-gray-600" />;
  }
};

const getMethodBadge = (method: string) => {
  const icons: Record<string, { bg: string; text: string; label: string }> = {
    card: { bg: "bg-blue-100", text: "text-blue-700", label: "Card" },
    bank_transfer: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Bank Transfer" },
    check: { bg: "bg-purple-100", text: "text-purple-700", label: "Check" },
  };
  const style = icons[method] || { bg: "bg-gray-100", text: "text-gray-700", label: method };

  return (
    <span className={`px-2 py-1 ${style.bg} ${style.text} text-xs font-medium rounded-full flex items-center gap-1`}>
      {getMethodIcon(method)} {style.label}
    </span>
  );
};

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch = payment.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoice.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = methodFilter === "all" || payment.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const totalCollected = mockPayments.reduce((sum, p) => sum + p.amount, 0);
  const thisMonth = mockPayments.filter(p => p.date.includes("Jan")).reduce((sum, p) => sum + p.amount, 0);
  const lastMonth = mockPayments.filter(p => p.date.includes("Dec")).reduce((sum, p) => sum + p.amount, 0);

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-500 mt-1">Track all tenant payments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCollected)}</p>
              <p className="text-sm text-gray-500">Total Collected</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(thisMonth)}</p>
              <p className="text-sm text-gray-500">This Month</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-600">{formatCurrency(lastMonth)}</p>
              <p className="text-sm text-gray-500">Last Month</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">{mockPayments.length}</p>
              <p className="text-sm text-gray-500">Transactions</p>
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
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Methods</option>
              <option value="card">Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="check">Check</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{payment.tenant}</p>
                      <p className="text-sm text-gray-500">{payment.property}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-gray-600">{payment.invoice}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-emerald-600">{formatCurrency(payment.amount)}</span>
                  </td>
                  <td className="px-6 py-4">{getMethodBadge(payment.method)}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{payment.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1 w-fit">
                      <CheckCircle className="w-3 h-3" /> Completed
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg" title="View Receipt">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Download">
                        <Download className="w-4 h-4" />
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
