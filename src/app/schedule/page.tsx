"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MiniCalendar from "@/components/MiniCalendar";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import {
  Calendar,
  User,
  Mail,
  Phone,
  DollarSign,
  CheckCircle,
  Home,
  FileText,
  ArrowRight,
  Info,
} from "lucide-react";

function ScheduleContent() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  const propertyAddress = searchParams.get("address");

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    budgetRange: "",
    preApproved: "",
    notes: "",
  });

  // Pre-fill form from localStorage if available
  useEffect(() => {
    const leadData = localStorage.getItem("leadData");
    if (leadData) {
      try {
        const parsed = JSON.parse(leadData);
        setFormData((prev) => ({
          ...prev,
          name: parsed.name || "",
          email: parsed.email || "",
          phone: parsed.phone || "",
        }));
      } catch (e) {
        console.error("Error parsing lead data:", e);
      }
    }
  }, []);

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

    if (!selectedDate) {
      newErrors.date = "Please select a date";
    }

    if (!selectedTime) {
      newErrors.time = "Please select a time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/showings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          budgetRange: formData.budgetRange,
          preApproved: formData.preApproved,
          notes: formData.notes,
          propertyId,
          propertyAddress,
          date: selectedDate?.toISOString(),
          time: selectedTime,
        }),
      });

      if (response.ok) {
        // Store showing data in localStorage
        localStorage.setItem(
          "showingData",
          JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            propertyAddress: propertyAddress || "General Inquiry",
            date: selectedDate?.toISOString(),
            time: selectedTime,
            bookedAt: new Date().toISOString(),
          })
        );

        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Error booking showing:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Showing Confirmed!
              </h1>
              <p className="text-gray-600 mb-6">
                Thank you, {formData.name}! Your showing has been scheduled for:
              </p>
              <div className="bg-emerald-50 rounded-xl p-6 mb-6">
                <p className="text-lg font-semibold text-emerald-700">
                  {selectedDate?.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {selectedTime}
                </p>
                {propertyAddress && (
                  <p className="text-sm text-emerald-600 mt-3 flex items-center justify-center">
                    <Home className="w-4 h-4 mr-1" />
                    {decodeURIComponent(propertyAddress)}
                  </p>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-6">
                A confirmation email has been sent to {formData.email}. One of our
                agents will contact you shortly to confirm the details.
              </p>
              <a
                href="/"
                className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
              >
                Back to Home
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 mb-4">
              <Calendar className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Schedule a Showing
            </h1>
            <p className="text-gray-600 text-lg">
              Book your private tour with one of our experienced agents
            </p>
            {propertyAddress && (
              <div className="mt-4 inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                <Home className="w-4 h-4 mr-2" />
                {decodeURIComponent(propertyAddress)}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Calendar and Time Selection */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-emerald-600" />
                  Select a Date
                </h2>
                <MiniCalendar
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-2">{errors.date}</p>
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-emerald-600" />
                  Select a Time
                </h2>
                <TimeSlotPicker
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onSelectTime={setSelectedTime}
                />
                {errors.time && (
                  <p className="text-red-500 text-sm mt-2">{errors.time}</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-emerald-600" />
                Your Information
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
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
              </div>
            </div>

            {/* Property Preferences */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-emerald-600" />
                Property Preferences
              </h2>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Budget Range
                  </label>
                  <select
                    value={formData.budgetRange}
                    onChange={(e) =>
                      setFormData({ ...formData, budgetRange: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-700"
                  >
                    <option value="">Select budget range</option>
                    <option value="under-400k">Under $400K</option>
                    <option value="400k-600k">$400K - $600K</option>
                    <option value="600k-1m">$600K - $1M</option>
                    <option value="over-1m">Over $1M</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Pre-approved for Mortgage?
                  </label>
                  <select
                    value={formData.preApproved}
                    onChange={(e) =>
                      setFormData({ ...formData, preApproved: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-700"
                  >
                    <option value="">Select status</option>
                    <option value="yes">Yes, I&apos;m pre-approved</option>
                    <option value="no">No, not yet</option>
                    <option value="planning">Not yet, but planning to</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Additional Notes or Questions
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Any specific features you're looking for? Questions about the property?"
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-700 resize-none"
                />
              </div>
            </div>

            {/* Coming Soon Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Coming Soon: Calendar Sync
                  </p>
                  <p className="text-sm text-blue-600">
                    Soon you&apos;ll be able to sync your Google Calendar, iCal, or
                    Calendly to automatically see your availability and avoid
                    scheduling conflicts.
                  </p>
                </div>
              </div>
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
                  <Calendar className="w-5 h-5" />
                  <span>Confirm Booking</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function SchedulePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-16 px-4 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </main>
    }>
      <ScheduleContent />
    </Suspense>
  );
}
