"use client";

import { useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import {
  ArrowLeft,
  FileText,
  User,
  Building,
  DollarSign,
  Calendar,
  Plus,
  Trash2,
  Send,
  Save,
  CheckCircle,
} from "lucide-react";

const mockTenants = [
  { id: "t1", name: "Marcus Johnson", property: "456 Riverside Dr, Unit 3A", email: "mjohnson@email.com" },
  { id: "t2", name: "Lisa Chen", property: "789 Oakwood Lane, Unit 2B", email: "lchen@email.com" },
  { id: "t3", name: "David Williams", property: "123 Downtown Plaza, Unit 5C", email: "dwilliams@email.com" },
  { id: "t4", name: "Sarah Miller", property: "321 Tech Park Ave, Unit 1A", email: "smiller@email.com" },
  { id: "t5", name: "James Rodriguez", property: "555 Beachfront Blvd, Unit 4D", email: "jrodriguez@email.com" },
];

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function CreateInvoicePage() {
  const [selectedTenant, setSelectedTenant] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", description: "Monthly Rent", quantity: 1, unitPrice: 0 },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState<"saved" | "sent" | null>(null);

  const selectedTenantData = mockTenants.find((t) => t.id === selectedTenant);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now().toString(), description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(
      lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSuccess("saved");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleSendInvoice = async () => {
    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSending(false);
    setSuccess("sent");
    setTimeout(() => setSuccess(null), 3000);
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `INV-${year}${month}-${random}`;
  };

  const [invoiceNumber] = useState(generateInvoiceNumber());

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-6">
        <Link
          href="/demo/admin/invoices"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Invoices
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Invoice</h1>
            <p className="text-gray-500 mt-1">Generate a new invoice for a tenant</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving || !selectedTenant}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save Draft</span>
            </button>
            <button
              onClick={handleSendInvoice}
              disabled={isSending || !selectedTenant || !dueDate}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Send Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <span className="text-emerald-800 font-medium">
            {success === "saved"
              ? "Invoice saved as draft successfully!"
              : "Invoice sent to tenant successfully!"}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Details */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Invoice Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Tenant Selection */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              Bill To
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Tenant <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Choose a tenant...</option>
                {mockTenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name} - {tenant.property}
                  </option>
                ))}
              </select>
            </div>

            {selectedTenantData && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {selectedTenantData.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedTenantData.name}</p>
                    <p className="text-sm text-gray-500">{selectedTenantData.email}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <Building className="w-3 h-3" />
                      {selectedTenantData.property}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Line Items
              </h2>
              <button
                onClick={addLineItem}
                className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {/* Header */}
              <div className="grid grid-cols-12 gap-3 text-sm font-medium text-gray-500 px-2">
                <div className="col-span-6">Description</div>
                <div className="col-span-2">Qty</div>
                <div className="col-span-3">Unit Price</div>
                <div className="col-span-1"></div>
              </div>

              {/* Items */}
              {lineItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-3 items-center bg-gray-50 rounded-lg p-3"
                >
                  <div className="col-span-6">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        updateLineItem(item.id, "description", e.target.value)
                      }
                      placeholder="e.g., Monthly Rent"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateLineItem(item.id, "quantity", parseInt(e.target.value) || 1)
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="col-span-3">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice || ""}
                        onChange={(e) =>
                          updateLineItem(
                            item.id,
                            "unitPrice",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="0.00"
                        className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => removeLineItem(item.id)}
                      disabled={lineItems.length === 1}
                      className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-500">Quick add:</span>
              {[
                { label: "Late Fee", amount: 50 },
                { label: "Parking", amount: 100 },
                { label: "Pet Fee", amount: 25 },
                { label: "Utilities", amount: 150 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() =>
                    setLineItems([
                      ...lineItems,
                      {
                        id: Date.now().toString(),
                        description: preset.label,
                        quantity: 1,
                        unitPrice: preset.amount,
                      },
                    ])
                  }
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                >
                  + {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes or payment instructions..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>
        </div>

        {/* Invoice Preview / Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Summary</h2>

            {/* Preview Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 text-white mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400 text-sm">Invoice</span>
                <span className="text-sm font-mono">{invoiceNumber}</span>
              </div>
              <div className="text-3xl font-bold mb-4">{formatCurrency(subtotal)}</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Tenant</span>
                  <span className="text-white">
                    {selectedTenantData?.name || "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Due Date</span>
                  <span className="text-white">
                    {dueDate
                      ? new Date(dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Not set"}
                  </span>
                </div>
              </div>
            </div>

            {/* Line Items Summary */}
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-medium text-gray-500">Items</h3>
              {lineItems
                .filter((item) => item.description && item.unitPrice > 0)
                .map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.description} x{item.quantity}
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </span>
                  </div>
                ))}
              {lineItems.filter((item) => item.description && item.unitPrice > 0)
                .length === 0 && (
                <p className="text-sm text-gray-400 italic">No items added yet</p>
              )}
            </div>

            {/* Total */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total Due</span>
                <span className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Accepted Payment Methods
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Bank Transfer", "Credit Card", "Check", "Zelle"].map((method) => (
                  <span
                    key={method}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
