"use client";

import { useState, useEffect } from "react";
import { X, Home, ArrowRight, Check, Phone, Mail, User } from "lucide-react";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadData) => void;
  source?: string;
}

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  source: string;
}

export default function LeadCaptureModal({
  isOpen,
  onClose,
  onSubmit,
  source = "lead_capture_modal",
}: LeadCaptureModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-\(\)\+]{10,}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const phoneNumber = value.replace(/\D/g, "");

    // Format as (XXX) XXX-XXXX
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to API
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          source,
        }),
      });

      if (response.ok) {
        // Store in localStorage that user has submitted lead info
        localStorage.setItem("leadCaptured", "true");
        localStorage.setItem(
          "leadData",
          JSON.stringify({
            name: formData.name,
            email: formData.email,
            capturedAt: new Date().toISOString(),
          })
        );

        setIsSuccess(true);
        onSubmit({ ...formData, source });

        // Auto close after success
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-6 py-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Find Your Dream Home
          </h2>
          <p className="text-white/80 text-sm">
            Get instant access to exclusive listings and personalized property recommendations
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Welcome!
              </h3>
              <p className="text-gray-600">
                You now have full access to all listings
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="John Smith"
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.name ? "border-red-300" : "border-gray-200"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@example.com"
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.email ? "border-red-300" : "border-gray-200"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="(555) 123-4567"
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.phone ? "border-red-300" : "border-gray-200"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Get Access Now</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Privacy Note */}
              <p className="text-xs text-gray-500 text-center">
                By continuing, you agree to receive property updates and marketing communications.
                We respect your privacy and will never share your information.
              </p>
            </form>
          )}
        </div>

        {/* Benefits */}
        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
              What you&apos;ll get:
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Access to all property listings</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>24/7 AI assistant support</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>New listing alerts in your area</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Free home valuation reports</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook to check if lead has been captured
export function useLeadCapture() {
  const [hasSubmitted, setHasSubmitted] = useState(true); // Default true to prevent flash

  useEffect(() => {
    const captured = localStorage.getItem("leadCaptured");
    setHasSubmitted(captured === "true");
  }, []);

  const resetCapture = () => {
    localStorage.removeItem("leadCaptured");
    localStorage.removeItem("leadData");
    setHasSubmitted(false);
  };

  return { hasSubmitted, setHasSubmitted, resetCapture };
}
