"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Home,
  FileText,
  Wrench,
  CreditCard,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  X,
  Upload,
  Send,
} from "lucide-react";

// Mock tenant data (in real app, would come from auth/session)
const mockTenant = {
  id: "t1",
  name: "Marcus Johnson",
  email: "mjohnson@email.com",
  phone: "(555) 111-2222",
  property: "456 Riverside Dr, Unit 3A",
  rent: 1850,
  leaseEnd: "2025-08-31",
};

// Mock invoices for this tenant
const tenantInvoices = [
  { id: "inv1", invoiceNumber: "INV-202501-0001", description: "January 2025 Rent", amount: 1850, dueDate: "2025-01-01", status: "paid", paidDate: "2024-12-28" },
  { id: "inv6", invoiceNumber: "INV-202502-0001", description: "February 2025 Rent", amount: 1850, dueDate: "2025-02-01", status: "pending", paidDate: null },
];

// Mock tickets for this tenant
const tenantTickets = [
  { id: "tkt1", ticketNumber: "TKT-202501-0001", category: "plumbing", priority: "high", title: "Leaking faucet in kitchen", status: "in_progress", createdAt: "Jan 24, 2025", assignedTo: "Mike's Plumbing" },
];

const categories = [
  { value: "plumbing", label: "Plumbing", icon: "🔧" },
  { value: "electrical", label: "Electrical", icon: "⚡" },
  { value: "hvac", label: "HVAC / Heating / Cooling", icon: "❄️" },
  { value: "appliance", label: "Appliance", icon: "🔌" },
  { value: "structural", label: "Structural / Walls / Floors", icon: "🏗️" },
  { value: "pest", label: "Pest Control", icon: "🐛" },
  { value: "other", label: "Other", icon: "🔨" },
];

const priorities = [
  { value: "low", label: "Low", description: "Can wait a few days" },
  { value: "medium", label: "Medium", description: "Should be addressed soon" },
  { value: "high", label: "High", description: "Needs attention today" },
  { value: "emergency", label: "Emergency", description: "Safety hazard / no water / no power" },
];

export default function TenantPortal() {
  const [activeTab, setActiveTab] = useState<"overview" | "invoices" | "maintenance" | "submit">("overview");
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    category: "",
    priority: "medium",
    title: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/maintenance-tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_name: mockTenant.name,
          tenant_email: mockTenant.email,
          property_address: mockTenant.property,
          category: ticketForm.category,
          priority: ticketForm.priority,
          title: ticketForm.title,
          description: ticketForm.description,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitSuccess(true);
        setTicketForm({ category: "", priority: "medium", title: "", description: "" });
        setTimeout(() => {
          setShowTicketForm(false);
          setSubmitSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
      alert("Failed to submit ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center"><CheckCircle className="w-3 h-3 mr-1" />Paid</span>;
      case "pending":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full flex items-center"><Clock className="w-3 h-3 mr-1" />Due</span>;
      case "overdue":
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full flex items-center"><AlertTriangle className="w-3 h-3 mr-1" />Overdue</span>;
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
        return <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">Scheduled</span>;
      case "completed":
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center"><CheckCircle className="w-3 h-3 mr-1" />Completed</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back to Site</span>
              </Link>
              <div className="h-6 w-px bg-gray-200" />
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <div>
                  <h1 className="font-bold text-gray-900">Tenant Portal</h1>
                  <p className="text-xs text-gray-500">Chatman RP</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="hidden sm:inline text-sm text-gray-600">Welcome, {mockTenant.name.split(" ")[0]}</span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-medium text-sm">
                {mockTenant.name.split(" ").map(n => n[0]).join("")}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Tenant Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">{mockTenant.property}</h2>
                <p className="text-sm text-gray-500">Lease ends: {mockTenant.leaseEnd}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center"><Mail className="w-4 h-4 mr-1" />{mockTenant.email}</span>
                  <span className="flex items-center"><Phone className="w-4 h-4 mr-1" />{mockTenant.phone}</span>
                </div>
              </div>
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm text-gray-500">Monthly Rent</p>
              <p className="text-2xl font-bold text-gray-900">${mockTenant.rent.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => setShowTicketForm(true)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:border-orange-300 hover:shadow-md transition-all text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mb-3">
              <Wrench className="w-5 h-5 text-orange-600" />
            </div>
            <p className="font-medium text-gray-900">Submit Request</p>
            <p className="text-xs text-gray-500">Maintenance issue</p>
          </button>

          <button className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:border-green-300 hover:shadow-md transition-all text-left">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <p className="font-medium text-gray-900">Pay Rent</p>
            <p className="text-xs text-gray-500">Make a payment</p>
          </button>

          <button className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:border-blue-300 hover:shadow-md transition-all text-left">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <p className="font-medium text-gray-900">View Invoices</p>
            <p className="text-xs text-gray-500">Payment history</p>
          </button>

          <button className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:border-purple-300 hover:shadow-md transition-all text-left">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
              <Phone className="w-5 h-5 text-purple-600" />
            </div>
            <p className="font-medium text-gray-900">Contact Us</p>
            <p className="text-xs text-gray-500">Get help</p>
          </button>
        </div>

        {/* Invoices Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">Recent Invoices</h3>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {tenantInvoices.map((invoice) => (
              <div key={invoice.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{invoice.description}</p>
                  <p className="text-sm text-gray-500">Due: {invoice.dueDate}</p>
                </div>
                <div className="text-right flex items-center space-x-4">
                  <div>
                    <p className="font-semibold text-gray-900">${invoice.amount.toLocaleString()}</p>
                    {getStatusBadge(invoice.status)}
                  </div>
                  {invoice.status === "pending" && (
                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium text-sm hover:bg-green-600 transition-colors">
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Tickets Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Wrench className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-gray-900">Maintenance Requests</h3>
              </div>
              <button
                onClick={() => setShowTicketForm(true)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Request</span>
              </button>
            </div>
          </div>
          {tenantTickets.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {tenantTickets.map((ticket) => (
                <div key={ticket.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">{categories.find(c => c.value === ticket.category)?.icon}</span>
                        <p className="font-medium text-gray-900">{ticket.title}</p>
                        {getTicketStatusBadge(ticket.status)}
                      </div>
                      <p className="text-sm text-gray-500">#{ticket.ticketNumber} • Submitted {ticket.createdAt}</p>
                      {ticket.assignedTo && (
                        <p className="text-sm text-blue-600 mt-1">Assigned to: {ticket.assignedTo}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No maintenance requests</p>
              <button
                onClick={() => setShowTicketForm(true)}
                className="mt-3 text-orange-600 font-medium hover:text-orange-700"
              >
                Submit a request
              </button>
            </div>
          )}
        </div>

        {/* Admin Link for Demo */}
        <div className="mt-6 text-center">
          <Link
            href="/demo/admin"
            className="text-sm text-gray-500 hover:text-emerald-600"
          >
            View Admin Dashboard (Demo)
          </Link>
        </div>
      </main>

      {/* Submit Ticket Modal */}
      {showTicketForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Submit Maintenance Request</h3>
                <button
                  onClick={() => setShowTicketForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Request Submitted!</h4>
                <p className="text-gray-500">We'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket}>
                <div className="p-6 space-y-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setTicketForm({...ticketForm, category: cat.value})}
                          className={`flex items-center space-x-2 p-3 border rounded-lg text-left transition-colors ${
                            ticketForm.category === cat.value
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <span className="text-xl">{cat.icon}</span>
                          <span className="text-sm font-medium text-gray-700">{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <div className="grid grid-cols-2 gap-2">
                      {priorities.map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => setTicketForm({...ticketForm, priority: p.value})}
                          className={`p-3 border rounded-lg text-left transition-colors ${
                            ticketForm.priority === p.value
                              ? p.value === "emergency"
                                ? "border-red-500 bg-red-50"
                                : "border-orange-500 bg-orange-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <p className={`font-medium ${p.value === "emergency" ? "text-red-700" : "text-gray-700"}`}>
                            {p.label}
                          </p>
                          <p className="text-xs text-gray-500">{p.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
                    <input
                      type="text"
                      required
                      placeholder="Brief description of the issue"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={ticketForm.title}
                      onChange={(e) => setTicketForm({...ticketForm, title: e.target.value})}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please provide as much detail as possible about the issue..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                    />
                  </div>

                  {/* Photo Upload (placeholder) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Photos (optional)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Click to upload photos</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowTicketForm(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !ticketForm.category || !ticketForm.title}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Request</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
