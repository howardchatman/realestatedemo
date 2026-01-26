"use client";

import { useState } from "react";
import { Home, MapPin, TrendingUp, DollarSign, Check, Sparkles } from "lucide-react";
import { useValuation } from "@/hooks/useValuation";
import ValuationLeadModal from "./ValuationLeadModal";

export default function HomeValuation() {
  const [address, setAddress] = useState("");
  const [showLeadModal, setShowLeadModal] = useState(false);
  const {
    valuation,
    isLoading,
    error,
    fetchValuation,
    submitWithLead,
    reset,
  } = useValuation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (address) {
      const result = await fetchValuation(address);
      if (result) {
        // Auto-open lead modal after 2 seconds
        setTimeout(() => setShowLeadModal(true), 2000);
      }
    }
  };

  const handleReset = () => {
    reset();
    setAddress("");
  };

  const handleLeadSubmit = async (leadData: { name: string; email: string; phone: string }) => {
    return await submitWithLead(leadData);
  };

  return (
    <section id="valuation" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-emerald-50 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-emerald-600 mr-2" />
              <span className="text-emerald-600 font-semibold text-sm">
                AI-Powered Valuation
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Discover What Your
              <span className="text-emerald-600"> Home is Worth</span>
            </h2>

            <p className="text-lg text-gray-600 mb-8">
              Get an instant, accurate estimate of your property&apos;s value using our advanced AI technology. Our system analyzes millions of data points to give you a comprehensive market analysis.
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {[
                "Instant results powered by AI",
                "Compare with recent sales in your area",
                "Get a detailed market analysis report",
                "No obligation, completely free",
              ].map((benefit) => (
                <div key={benefit} className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8">
              <div>
                <div className="text-3xl font-bold text-gray-900">98%</div>
                <div className="text-gray-500">Accuracy Rate</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div>
                <div className="text-3xl font-bold text-gray-900">50K+</div>
                <div className="text-gray-500">Valuations Done</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div>
                <div className="text-3xl font-bold text-gray-900">Free</div>
                <div className="text-gray-500">Always</div>
              </div>
            </div>
          </div>

          {/* Right - Valuation Form */}
          <div>
            <div className="bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 rounded-3xl p-8 shadow-2xl">
              {!valuation ? (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-4">
                      <Home className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Free Home Valuation
                    </h3>
                    <p className="text-white/70">
                      Enter your address to get started
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your property address"
                        className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>

                    {error && (
                      <p className="text-red-400 text-sm text-center">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Analyzing Market Data...</span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-5 h-5" />
                          <span>Get My Home Value</span>
                        </>
                      )}
                    </button>
                  </form>

                  <p className="text-center text-white/50 text-sm mt-4">
                    By submitting, you agree to receive updates from us.
                  </p>
                </>
              ) : (
                /* Result View */
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-6">
                    <DollarSign className="w-10 h-10 text-white" />
                  </div>

                  <h3 className="text-xl text-white/70 mb-2">
                    Your Estimated Home Value
                  </h3>
                  <div className="text-5xl font-bold text-white mb-2">
                    {valuation.formatted.estimated}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-emerald-400 font-medium mb-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>{valuation.formatted.trend} from last year</span>
                  </div>
                  <p className="text-white/50 text-sm mb-6">
                    Based on {valuation.comparable_count} similar properties
                  </p>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-white">{valuation.formatted.low}</div>
                        <div className="text-white/60 text-sm">Low Estimate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-emerald-400">{valuation.formatted.estimated}</div>
                        <div className="text-white/60 text-sm">Estimate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{valuation.formatted.high}</div>
                        <div className="text-white/60 text-sm">High Estimate</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      valuation.confidence === 'high'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : valuation.confidence === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {valuation.confidence.charAt(0).toUpperCase() + valuation.confidence.slice(1)} Confidence
                    </span>
                  </div>

                  <button
                    onClick={() => setShowLeadModal(true)}
                    className="w-full py-4 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all mb-4"
                  >
                    Get Full Report
                  </button>

                  <button
                    onClick={handleReset}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    Try another address
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Valuation Lead Modal */}
      {valuation && (
        <ValuationLeadModal
          isOpen={showLeadModal}
          onClose={() => setShowLeadModal(false)}
          onSubmit={handleLeadSubmit}
          valuation={valuation}
          address={address}
        />
      )}
    </section>
  );
}
