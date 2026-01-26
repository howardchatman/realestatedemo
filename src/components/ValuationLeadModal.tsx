"use client";

import { useState, useEffect } from "react";
import { X, DollarSign, TrendingUp, Phone, Mail, User, FileText, Check, BarChart3 } from "lucide-react";
import type { ValuationResult, LeadData } from "@/hooks/useValuation";

interface ValuationLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadData) => Promise<boolean>;
  valuation: ValuationResult;
  address: string;
}

export default function ValuationLeadModal({
  isOpen,
  onClose,
  onSubmit,
  valuation,
  address,
}: ValuationLeadModalProps) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    const newErrors: Record<string, string> = {};

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
    const phoneNumber = value.replace(/\D/g, "");
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
      const success = await onSubmit(formData);

      if (success) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setFormData({ name: "", email: "", phone: "" });
        }, 2500);
      }
    } catch (error) {
      console.error("Error submitting valuation lead:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Valuation Preview */}
        <div className="bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 px-6 py-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-3">
            <DollarSign className="w-7 h-7 text-white" />
          </div>

          <p className="text-white/70 text-sm mb-1">Your Estimated Home Value</p>
          <div className="text-4xl font-bold text-white mb-2">
            {valuation.formatted.estimated}
          </div>

          <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>{valuation.formatted.trend} from last year</span>
          </div>

          <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/60">Estimate Range:</span>
              <span className="text-white font-medium">
                {valuation.formatted.low} - {valuation.formatted.high}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Based on:</span>
              <span className="text-white font-medium">
                {valuation.comparable_count} similar properties
              </span>
            </div>
          </div>

          <p className="text-white/50 text-xs mt-3 truncate px-4">
            {address}
          </p>
        </div>

        {/* Form Section */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Report on the Way!</h3>
              <p className="text-gray-600">
                Check your email for your detailed valuation report with comparable sales and market analysis.
              </p>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Get Your Free Detailed Report
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Includes comparable sales, market trends, and a professional analysis from our agents.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Name */}
                <div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
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
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Your email address"
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Get My Full Report</span>
                  )}
                </button>
              </form>

              {/* What's included */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Your report includes:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Comparable sales</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Market trends</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Price history</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Agent CMA</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center mt-4">
                We respect your privacy. Your info is never shared.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
