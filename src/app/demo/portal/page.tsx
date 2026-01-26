"use client";

import { useState, useRef } from "react";
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
  Sparkles,
  FileSignature,
  Eye,
  Download,
  Image as ImageIcon,
  Trash2,
  Loader2,
  PenTool,
} from "lucide-react";

// Mock tenant data
const mockTenant = {
  id: "t1",
  name: "Marcus Johnson",
  email: "mjohnson@email.com",
  phone: "(555) 111-2222",
  property: "456 Riverside Dr, Unit 3A",
  rent: 1850,
  leaseEnd: "2025-08-31",
};

// Mock invoices
const tenantInvoices = [
  { id: "inv1", invoiceNumber: "INV-202501-0001", description: "January 2025 Rent", amount: 1850, dueDate: "2025-01-01", status: "paid", paidDate: "2024-12-28" },
  { id: "inv6", invoiceNumber: "INV-202502-0001", description: "February 2025 Rent", amount: 1850, dueDate: "2025-02-01", status: "pending", paidDate: null },
];

// Mock tickets
const tenantTickets = [
  { id: "tkt1", ticketNumber: "TKT-202501-0001", category: "plumbing", priority: "high", title: "Leaking faucet in kitchen", status: "in_progress", createdAt: "Jan 24, 2025", assignedTo: "Mike's Plumbing" },
];

// Mock documents
const mockDocuments = [
  { id: "doc1", name: "Lease Agreement 2024-2025.pdf", type: "lease", uploadedAt: "Aug 15, 2024", size: "245 KB", status: "signed" },
  { id: "doc2", name: "Move-In Inspection Report.pdf", type: "agreement", uploadedAt: "Aug 15, 2024", size: "1.2 MB", status: "signed" },
  { id: "doc3", name: "Lease Renewal 2025-2026.pdf", type: "contract", uploadedAt: "Jan 20, 2025", size: "198 KB", status: "pending_signature" },
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

interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
}

export default function TenantPortal() {
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showSigningModal, setShowSigningModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<typeof mockDocuments[0] | null>(null);

  const [ticketForm, setTicketForm] = useState({
    category: "",
    priority: "medium",
    title: "",
    description: "",
  });
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Document analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<"lease" | "contract" | "agreement" | "other">("lease");

  // Signing state
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [signatureComplete, setSignatureComplete] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  // Photo upload handlers
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos: UploadedPhoto[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
    }));
    setUploadedPhotos((prev) => [...prev, ...newPhotos].slice(0, 5)); // Max 5 photos
  };

  const removePhoto = (id: string) => {
    setUploadedPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo) URL.revokeObjectURL(photo.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  // Document handlers
  const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedDocument(file);
      setAnalysisResult(null);
    }
  };

  const analyzeDocument = async () => {
    if (!uploadedDocument) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      // Read file content (for text-based files)
      const text = await uploadedDocument.text();

      const response = await fetch("/api/ai/analyze-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentType,
          documentText: text,
          fileName: uploadedDocument.name,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAnalysisResult(data.data.analysis);
      } else {
        setAnalysisResult("Unable to analyze this document. Please ensure it's a text-based file (PDF text, TXT, etc.).");
      }
    } catch (error) {
      console.error("Error analyzing document:", error);
      setAnalysisResult("Error analyzing document. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Signature canvas handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1f2937";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setSignatureData(canvas.toDataURL());
  };

  const submitSignature = async () => {
    if (!signatureData || !selectedDocument) return;

    setIsSigning(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSignatureComplete(true);
    setIsSigning(false);

    setTimeout(() => {
      setShowSigningModal(false);
      setSignatureComplete(false);
      setSignatureData(null);
      setSelectedDocument(null);
    }, 2000);
  };

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
          photos: uploadedPhotos.length, // In real app, would upload photos to storage
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitSuccess(true);
        setTicketForm({ category: "", priority: "medium", title: "", description: "" });
        setUploadedPhotos([]);
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

  const getDocStatusBadge = (status: string) => {
    switch (status) {
      case "signed":
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center"><CheckCircle className="w-3 h-3 mr-1" />Signed</span>;
      case "pending_signature":
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full flex items-center"><PenTool className="w-3 h-3 mr-1" />Sign Now</span>;
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

          <button
            onClick={() => setShowDocumentModal(true)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:border-violet-300 hover:shadow-md transition-all text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center mb-3">
              <FileSignature className="w-5 h-5 text-violet-600" />
            </div>
            <p className="font-medium text-gray-900">Documents</p>
            <p className="text-xs text-gray-500">View & sign</p>
          </button>

          <button className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:border-purple-300 hover:shadow-md transition-all text-left">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
              <Phone className="w-5 h-5 text-purple-600" />
            </div>
            <p className="font-medium text-gray-900">Contact Us</p>
            <p className="text-xs text-gray-500">Get help</p>
          </button>
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileSignature className="w-5 h-5 text-violet-600" />
                <h3 className="font-bold text-gray-900">My Documents</h3>
              </div>
              <button
                onClick={() => setShowAnalysisModal(true)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-violet-500 text-white rounded-lg text-sm font-medium hover:bg-violet-600 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Analyze</span>
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {mockDocuments.map((doc) => (
              <div key={doc.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-500">{doc.uploadedAt} • {doc.size}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getDocStatusBadge(doc.status)}
                  <div className="flex items-center space-x-1">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Download className="w-4 h-4" />
                    </button>
                    {doc.status === "pending_signature" && (
                      <button
                        onClick={() => {
                          setSelectedDocument(doc);
                          setShowSigningModal(true);
                        }}
                        className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
                      >
                        Sign
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invoices Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">Recent Invoices</h3>
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
          <Link href="/demo/admin" className="text-sm text-gray-500 hover:text-emerald-600">
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
                <button onClick={() => setShowTicketForm(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
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
                <p className="text-gray-500">We&apos;ll get back to you as soon as possible.</p>
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
                            ticketForm.category === cat.value ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"
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
                              ? p.value === "emergency" ? "border-red-500 bg-red-50" : "border-orange-500 bg-orange-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <p className={`font-medium ${p.value === "emergency" ? "text-red-700" : "text-gray-700"}`}>{p.label}</p>
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

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Photos (optional, max 5)</label>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handlePhotoSelect}
                    />

                    {uploadedPhotos.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {uploadedPhotos.map((photo) => (
                          <div key={photo.id} className="relative group">
                            <img
                              src={photo.preview}
                              alt="Uploaded"
                              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(photo.id)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {uploadedPhotos.length < 5 && (
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors"
                      >
                        <ImageIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <p className="text-sm text-gray-500">Click to add photos</p>
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
                  <button type="button" onClick={() => setShowTicketForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !ticketForm.category || !ticketForm.title}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
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

      {/* Document Analysis Modal */}
      {showAnalysisModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-violet-600" />
                  <h3 className="text-lg font-bold text-gray-900">AI Document Analyzer</h3>
                </div>
                <button onClick={() => { setShowAnalysisModal(false); setAnalysisResult(null); setUploadedDocument(null); }} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">Upload a lease, contract, or agreement to get an AI-powered summary of key terms</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Document Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "lease", label: "Lease Agreement" },
                    { value: "contract", label: "Purchase Contract" },
                    { value: "agreement", label: "Other Agreement" },
                    { value: "other", label: "Other Document" },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setDocumentType(type.value as typeof documentType)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        documentType === type.value
                          ? "bg-violet-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Document</label>
                <input
                  ref={documentInputRef}
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleDocumentSelect}
                />

                {uploadedDocument ? (
                  <div className="flex items-center justify-between p-4 bg-violet-50 rounded-lg border border-violet-200">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-violet-600" />
                      <div>
                        <p className="font-medium text-gray-900">{uploadedDocument.name}</p>
                        <p className="text-sm text-gray-500">{(uploadedDocument.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setUploadedDocument(null); setAnalysisResult(null); }}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => documentInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-violet-400 transition-colors"
                  >
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">Click to upload document</p>
                    <p className="text-sm text-gray-400 mt-1">TXT, PDF, DOC, DOCX supported</p>
                  </button>
                )}
              </div>

              {/* Analyze Button */}
              {uploadedDocument && !analysisResult && (
                <button
                  onClick={analyzeDocument}
                  disabled={isAnalyzing}
                  className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-70"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing Document...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Analyze Document</span>
                    </>
                  )}
                </button>
              )}

              {/* Analysis Result */}
              {analysisResult && (
                <div className="mt-4">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Analysis Complete
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-sm text-gray-700 leading-relaxed max-h-96 overflow-y-auto">
                    {analysisResult}
                  </div>
                  <button
                    onClick={() => { setAnalysisResult(null); setUploadedDocument(null); }}
                    className="mt-4 text-violet-600 font-medium hover:text-violet-700"
                  >
                    Analyze another document
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Signing Modal */}
      {showSigningModal && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Sign Document</h3>
                  <p className="text-sm text-gray-500">{selectedDocument.name}</p>
                </div>
                <button onClick={() => { setShowSigningModal(false); setSignatureData(null); }} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {signatureComplete ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Document Signed!</h4>
                <p className="text-gray-500">Your signature has been applied to the document.</p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Draw Your Signature</label>
                  <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={150}
                      className="w-full cursor-crosshair touch-none"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <button onClick={clearSignature} className="text-sm text-gray-500 hover:text-gray-700">
                      Clear
                    </button>
                    <button onClick={saveSignature} className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                      Preview Signature
                    </button>
                  </div>
                </div>

                {signatureData && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Signature Preview:</p>
                    <img src={signatureData} alt="Signature" className="max-h-16" />
                  </div>
                )}

                <div className="flex items-start space-x-2">
                  <input type="checkbox" id="agree" className="mt-1 rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                  <label htmlFor="agree" className="text-sm text-gray-600">
                    I agree that this electronic signature is legally binding and equivalent to my handwritten signature.
                  </label>
                </div>

                <button
                  onClick={submitSignature}
                  disabled={!signatureData || isSigning}
                  className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSigning ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Signing...</span>
                    </>
                  ) : (
                    <>
                      <PenTool className="w-5 h-5" />
                      <span>Apply Signature</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Documents List Modal */}
      {showDocumentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileSignature className="w-5 h-5 text-violet-600" />
                  <h3 className="text-lg font-bold text-gray-900">All Documents</h3>
                </div>
                <button onClick={() => setShowDocumentModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {mockDocuments.map((doc) => (
                <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-500">{doc.uploadedAt} • {doc.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getDocStatusBadge(doc.status)}
                    <div className="flex items-center space-x-1">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Download className="w-4 h-4" />
                      </button>
                      {doc.status === "pending_signature" && (
                        <button
                          onClick={() => {
                            setSelectedDocument(doc);
                            setShowDocumentModal(false);
                            setShowSigningModal(true);
                          }}
                          className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
                        >
                          Sign
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => {
                  setShowDocumentModal(false);
                  setShowAnalysisModal(true);
                }}
                className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <Sparkles className="w-5 h-5" />
                <span>Analyze a Document with AI</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
