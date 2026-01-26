"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, DollarSign, BedDouble, ChevronDown, TrendingUp } from "lucide-react";
import { useValuation } from "@/hooks/useValuation";
import ValuationLeadModal from "./ValuationLeadModal";

export default function Hero() {
  const router = useRouter();
  const [searchType, setSearchType] = useState<"buy" | "sell">("buy");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [bedrooms, setBedrooms] = useState("");

  // Valuation state
  const [sellAddress, setSellAddress] = useState("");
  const [showValuationModal, setShowValuationModal] = useState(false);
  const {
    valuation,
    isLoading: isValuationLoading,
    error: valuationError,
    fetchValuation,
    submitWithLead,
    reset: resetValuation,
  } = useValuation();

  const handleGetValuation = async () => {
    if (sellAddress.trim()) {
      const result = await fetchValuation(sellAddress);
      if (result) {
        // Auto-open modal after showing results briefly
        setTimeout(() => setShowValuationModal(true), 1500);
      }
    }
  };

  const handleValuationLeadSubmit = async (leadData: { name: string; email: string; phone: string }) => {
    return await submitWithLead(leadData);
  };

  const handleResetValuation = () => {
    resetValuation();
    setSellAddress("");
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("q", location);
    if (propertyType) params.set("type", propertyType);
    if (priceRange) params.set("price", priceRange);
    if (bedrooms) params.set("beds", bedrooms);
    router.push(`/listings${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
          alt="Luxury home"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        <div className="max-w-3xl">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Find Your Perfect
            <span className="block text-emerald-400">Dream Home</span>
          </h1>

          <p className="text-xl text-white/80 mb-8 max-w-xl">
            Discover exceptional properties with personalized service. Our team is available 24/7 to help you find exactly what you&apos;re looking for.
          </p>

          {/* Search Box */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl">
            {/* Tabs */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setSearchType("buy")}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  searchType === "buy"
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setSearchType("sell")}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  searchType === "sell"
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Sell
              </button>
            </div>

            {searchType === "buy" ? (
              <>
                {/* Location Search */}
                <div className="relative mb-4">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter city, neighborhood, or ZIP code"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Property Type</option>
                      <option value="House">House</option>
                      <option value="Condo">Condo</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Multi-family">Multi-family</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Price Range</option>
                      <option value="200000-400000">$200K - $400K</option>
                      <option value="400000-600000">$400K - $600K</option>
                      <option value="600000-800000">$600K - $800K</option>
                      <option value="800000-1000000">$800K - $1M</option>
                      <option value="1000000-">$1M+</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Bedrooms</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                >
                  <Search className="w-5 h-5" />
                  <span>Search Properties</span>
                </button>
              </>
            ) : (
              <>
                {/* Sell - Home Valuation */}
                {!valuation ? (
                  <div className="text-center py-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      What&apos;s Your Home Worth?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Get a free, instant home valuation powered by AI
                    </p>
                    <div className="relative mb-4">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Enter your property address"
                        value={sellAddress}
                        onChange={(e) => setSellAddress(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleGetValuation()}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    {valuationError && (
                      <p className="text-red-500 text-sm mb-3">{valuationError}</p>
                    )}
                    <button
                      onClick={handleGetValuation}
                      disabled={isValuationLoading || !sellAddress.trim()}
                      className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {isValuationLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Analyzing Market Data...</span>
                        </>
                      ) : (
                        <span>Get Free Valuation</span>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 mb-1">Estimated Value</p>
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {valuation.formatted.estimated}
                    </div>
                    <div className="flex items-center justify-center gap-1 text-emerald-600 text-sm font-medium mb-4">
                      <TrendingUp className="w-4 h-4" />
                      <span>{valuation.formatted.trend} from last year</span>
                    </div>
                    <div className="flex justify-center gap-4 text-sm text-gray-600 mb-4">
                      <span>Low: {valuation.formatted.low}</span>
                      <span className="text-gray-300">|</span>
                      <span>High: {valuation.formatted.high}</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-4">
                      Based on {valuation.comparable_count} similar properties
                    </p>
                    <button
                      onClick={() => setShowValuationModal(true)}
                      className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                    >
                      Get Full Report Free
                    </button>
                    <button
                      onClick={handleResetValuation}
                      className="mt-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Try another address
                    </button>
                  </div>
                )}

                {/* Valuation Lead Modal */}
                {valuation && (
                  <ValuationLeadModal
                    isOpen={showValuationModal}
                    onClose={() => setShowValuationModal(false)}
                    onSubmit={handleValuationLeadSubmit}
                    valuation={valuation}
                    address={sellAddress}
                  />
                )}
              </>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-8 mt-8">
            <div>
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-white/70">Active Listings</div>
            </div>
            <div className="w-px h-12 bg-white/30" />
            <div>
              <div className="text-3xl font-bold text-white">$2.5B</div>
              <div className="text-white/70">Property Sold</div>
            </div>
            <div className="w-px h-12 bg-white/30" />
            <div>
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-white/70">Available Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
