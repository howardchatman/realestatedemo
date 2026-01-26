"use client";

import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  FileText,
  Search,
  Plus,
  Send,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
} from "lucide-react";

const mockInvoices = [
  { id: "inv1", invoiceNumber: "INV-202501-0001", tenant: "Marcus Johnson", property: "456 Riverside Dr, Unit 3A", description: "January 2025 Rent", amount: 1850, dueDate: "2025-01-01", status: "paid", paidDate: "2024-12-28" },
  { id: "inv2", invoiceNumber: "INV-202501-0002", tenant: "Lisa Chen", property: "789 Oakwood Lane, Unit 2B", description: "January 2025 Rent", amount: 2100, dueDate: "2025-01-01", status: "paid", paidDate: "2025-01-02" },
  { id: "inv3", invoiceNumber: "INV-202501-0003", tenant: "David Williams", property: "123 Downtown Plaza, Unit 5C", description: "January 2025 Rent", amount: 2450, dueDate: "2025-01-01", status: "overdue", paidDate: null },
  { id: "inv4", invoiceNumber: "INV-202501-0004", tenant: "Sarah Miller", property: "321 Tech Park Ave, Unit 1A", description: "January 2025 Rent", amount: 1950, dueDate: "2025-01-01", status: "paid", paidDate: "2025-01-01" },
  { id: "inv5", invoiceNumber: "INV-202501-0005", tenant: "James Rodriguez", property: "555 Beachfront Blvd, Unit 4D", description: "January 2025 Rent", amount: 2800, dueDate: "2025-01-01", status: "pending", paidDate: null },
  { id: "inv6", invoiceNumber: "INV-202502-0001", tenant: "Marcus Johnson", property: "456 Riverside Dr, Unit 3A", description: "February 2025 Rent", amount: 1850, dueDate: "2025-02-01", status: "sent", paidDate: null },
  { id: "inv7", invoiceNumber: "INV-202501-0006", tenant: "Lisa Chen", property: "789 Oakwood Lane, Unit 2B", description: "Late Fee - December", amount: 150, dueDate: "2025-01-15", status: "paid", paidDate: "2025-01-10" },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> Paid
        </span>
      );
    case "pending":
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3" /> Pending
        </span>
      );
    case "sent":
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
          <Send className="w-3 h-3" /> Sent
        </span>
      );
    case "overdue":
      return (
        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> Overdue
        </span>
      );
    default:
      return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{status}</span>;
  }
};

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch = invoice.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockInvoices.reduce((sum, i) => sum + i.amount, 0),
    paid: mockInvoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0),
    pending: mockInvoices.filter(i => i.status === "pending" || i.status === "sent").reduce((sum, i) => sum + i.amount, 0),
    overdue: mockInvoices.filter(i => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0),
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <p className="text-gray-500 mt-1">Manage billing and invoices for your tenants</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total)}</p>
              <p className="text-sm text-gray-500">Total Invoiced</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.paid)}</p>
              <p className="text-sm text-gray-500">Collected</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.pending)}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.overdue)}</p>
              <p className="text-sm text-gray-500">Overdue</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
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
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="sent">Sent</option>
              <option value="overdue">Overdue</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Create Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
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
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{invoice.invoiceNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{invoice.tenant}</p>
                      <p className="text-sm text-gray-500">{invoice.property}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{invoice.description}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">{formatCurrency(invoice.amount)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{formatDate(invoice.dueDate)}</span>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(invoice.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Send">
                        <Send className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg" title="Download">
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
