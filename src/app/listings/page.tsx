"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  BedDouble,
  Bath,
  Square,
  MapPin,
  Search,
  SlidersHorizontal,
  Grid,
  List,
  ChevronDown,
  X,
  Home,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIVAChat from "@/components/AIVAChat";
import LeadCaptureModal, { useLeadCapture } from "@/components/LeadCaptureModal";

// Sample listings data - in production, this would come from an API/database
const allListings = [
  {
    id: 1,
    title: "Modern Lakefront Estate",
    address: "123 Lakeview Drive, Oakwood",
    price: 1250000,
    beds: 5,
    baths: 4,
    sqft: 4200,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80",
    tag: "New Listing",
    tagColor: "bg-emerald-500",
    type: "House",
    yearBuilt: 2021,
    description: "Stunning lakefront estate with panoramic water views. Features include a gourmet kitchen, home theater, and private dock.",
  },
  {
    id: 2,
    title: "Downtown Luxury Penthouse",
    address: "456 Main Street, Unit PH1",
    price: 895000,
    beds: 3,
    baths: 2,
    sqft: 2100,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
    tag: "Featured",
    tagColor: "bg-blue-500",
    type: "Condo",
    yearBuilt: 2019,
    description: "Luxurious penthouse in the heart of downtown. Floor-to-ceiling windows, private terrace, and concierge service.",
  },
  {
    id: 3,
    title: "Charming Colonial Home",
    address: "789 Oak Street, Riverside",
    price: 675000,
    beds: 4,
    baths: 3,
    sqft: 2800,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    tag: "Open House",
    tagColor: "bg-orange-500",
    type: "House",
    yearBuilt: 1985,
    description: "Classic colonial charm meets modern updates. Hardwood floors throughout, updated kitchen, and beautifully landscaped yard.",
  },
  {
    id: 4,
    title: "Contemporary Smart Home",
    address: "321 Tech Park Lane",
    price: 785000,
    beds: 4,
    baths: 3,
    sqft: 3100,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
    tag: "Price Reduced",
    tagColor: "bg-red-500",
    type: "House",
    yearBuilt: 2022,
    description: "Fully automated smart home with cutting-edge technology. Solar panels, EV charging, and energy-efficient design.",
  },
  {
    id: 5,
    title: "Beachfront Paradise",
    address: "555 Ocean Boulevard",
    price: 2100000,
    beds: 6,
    baths: 5,
    sqft: 5500,
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80",
    tag: "Luxury",
    tagColor: "bg-purple-500",
    type: "House",
    yearBuilt: 2020,
    description: "Breathtaking oceanfront property with direct beach access. Infinity pool, outdoor kitchen, and guest house.",
  },
  {
    id: 6,
    title: "Cozy Mountain Retreat",
    address: "888 Pine Ridge Road",
    price: 525000,
    beds: 3,
    baths: 2,
    sqft: 1850,
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80",
    tag: "New Listing",
    tagColor: "bg-emerald-500",
    type: "House",
    yearBuilt: 2018,
    description: "Peaceful mountain retreat with stunning views. Wood-burning fireplace, wraparound deck, and hiking trails nearby.",
  },
  {
    id: 7,
    title: "Urban Loft Living",
    address: "100 Arts District Way, Unit 405",
    price: 450000,
    beds: 2,
    baths: 2,
    sqft: 1400,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
    tag: "Featured",
    tagColor: "bg-blue-500",
    type: "Condo",
    yearBuilt: 2017,
    description: "Trendy loft in the heart of the arts district. Exposed brick, high ceilings, and rooftop access.",
  },
  {
    id: 8,
    title: "Family-Friendly Suburban",
    address: "222 Maple Avenue",
    price: 595000,
    beds: 4,
    baths: 3,
    sqft: 2600,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80",
    tag: "Open House",
    tagColor: "bg-orange-500",
    type: "House",
    yearBuilt: 2015,
    description: "Perfect family home in top-rated school district. Large backyard, finished basement, and 3-car garage.",
  },
  {
    id: 9,
    title: "Historic Victorian Gem",
    address: "50 Heritage Lane",
    price: 825000,
    beds: 5,
    baths: 4,
    sqft: 3800,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
    tag: "Historic",
    tagColor: "bg-amber-600",
    type: "House",
    yearBuilt: 1895,
    description: "Meticulously restored Victorian with period details. Original woodwork, updated systems, and carriage house.",
  },
];

export default function ListingsPage() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");

  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [bedrooms, setBedrooms] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Lead capture modal state
  const { hasSubmitted, setHasSubmitted } = useLeadCapture();
  const [showLeadModal, setShowLeadModal] = useState(false);

  // Show lead capture modal after a short delay if not already captured
  useEffect(() => {
    if (!hasSubmitted) {
      const timer = setTimeout(() => {
        setShowLeadModal(true);
      }, 1500); // Show after 1.5 seconds
      return () => clearTimeout(timer);
    }
  }, [hasSubmitted]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const filteredListings = useMemo(() => {
    let results = [...allListings];

    // Apply filter param from URL
    if (filterParam === "new") {
      results = results.filter((l) => l.tag === "New Listing");
    } else if (filterParam === "openhouse") {
      results = results.filter((l) => l.tag === "Open House");
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (l) =>
          l.title.toLowerCase().includes(query) ||
          l.address.toLowerCase().includes(query)
      );
    }

    // Price range filter
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      results = results.filter((l) => {
        if (max) {
          return l.price >= min && l.price <= max;
        }
        return l.price >= min;
      });
    }

    // Property type filter
    if (propertyType !== "all") {
      results = results.filter((l) => l.type === propertyType);
    }

    // Bedrooms filter
    if (bedrooms !== "all") {
      const minBeds = parseInt(bedrooms);
      results = results.filter((l) => l.beds >= minBeds);
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        results.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        results.sort((a, b) => b.yearBuilt - a.yearBuilt);
        break;
      case "sqft":
        results.sort((a, b) => b.sqft - a.sqft);
        break;
    }

    return results;
  }, [searchQuery, priceRange, propertyType, bedrooms, sortBy, filterParam]);

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange("all");
    setPropertyType("all");
    setBedrooms("all");
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchQuery || priceRange !== "all" || propertyType !== "all" || bedrooms !== "all";

  return (
    <>
      <Navbar />

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        onSubmit={() => {
          setHasSubmitted(true);
          setShowLeadModal(false);
        }}
        source="listings_page"
      />

      <main className="min-h-screen bg-gray-50 pt-20">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {filterParam === "new"
                    ? "New Listings"
                    : filterParam === "openhouse"
                    ? "Open Houses"
                    : "All Properties"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {filteredListings.length} properties available
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location or property name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white border-b sticky top-20 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Filter Toggle (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                )}
              </button>

              {/* Desktop Filters */}
              <div className="hidden lg:flex items-center space-x-4">
                <div className="relative">
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">Any Price</option>
                    <option value="0-500000">Under $500K</option>
                    <option value="500000-750000">$500K - $750K</option>
                    <option value="750000-1000000">$750K - $1M</option>
                    <option value="1000000-2000000">$1M - $2M</option>
                    <option value="2000000-">$2M+</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">All Types</option>
                    <option value="House">House</option>
                    <option value="Condo">Condo</option>
                    <option value="Townhouse">Townhouse</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">Any Beds</option>
                    <option value="1">1+ Beds</option>
                    <option value="2">2+ Beds</option>
                    <option value="3">3+ Beds</option>
                    <option value="4">4+ Beds</option>
                    <option value="5">5+ Beds</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-900"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {/* Sort & View */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="sqft">Square Feet</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="hidden sm:flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid" ? "bg-emerald-50 text-emerald-600" : "text-gray-600"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list" ? "bg-emerald-50 text-emerald-600" : "text-gray-600"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Filters Dropdown */}
            {showFilters && (
              <div className="lg:hidden mt-4 pt-4 border-t space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <option value="all">Any Price</option>
                    <option value="0-500000">Under $500K</option>
                    <option value="500000-750000">$500K - $750K</option>
                    <option value="750000-1000000">$750K - $1M</option>
                    <option value="1000000-2000000">$1M - $2M</option>
                    <option value="2000000-">$2M+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <option value="all">All Types</option>
                    <option value="House">House</option>
                    <option value="Condo">Condo</option>
                    <option value="Townhouse">Townhouse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <option value="all">Any Beds</option>
                    <option value="1">1+ Beds</option>
                    <option value="2">2+ Beds</option>
                    <option value="3">3+ Beds</option>
                    <option value="4">4+ Beds</option>
                    <option value="5">5+ Beds</option>
                  </select>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full py-2 text-gray-600 border border-gray-200 rounded-lg"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Listings */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {filteredListings.length === 0 ? (
            <div className="text-center py-16">
              <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters to see more results</p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
              >
                Clear Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group block"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute top-4 left-4 ${listing.tagColor} text-white text-sm font-semibold px-3 py-1 rounded-full`}>
                      {listing.tag}
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(listing.id);
                      }}
                      className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        favorites.includes(listing.id)
                          ? "bg-red-500 text-white"
                          : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.includes(listing.id) ? "fill-current" : ""
                        }`}
                      />
                    </button>
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(listing.price)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {listing.title}
                    </h3>
                    <div className="flex items-center text-gray-500 mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{listing.address}</span>
                    </div>

                    {/* Features */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <BedDouble className="w-5 h-5" />
                        <span className="text-sm font-medium">{listing.beds} Beds</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Bath className="w-5 h-5" />
                        <span className="text-sm font-medium">{listing.baths} Baths</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Square className="w-5 h-5" />
                        <span className="text-sm font-medium">{listing.sqft.toLocaleString()} sqft</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all flex flex-col md:flex-row group block"
                >
                  {/* Image */}
                  <div className="relative w-full md:w-80 h-48 md:h-auto flex-shrink-0 overflow-hidden">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className={`absolute top-4 left-4 ${listing.tagColor} text-white text-sm font-semibold px-3 py-1 rounded-full`}>
                      {listing.tag}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                          {listing.title}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite(listing.id);
                          }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            favorites.includes(listing.id)
                              ? "bg-red-500 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-red-500"
                          }`}
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              favorites.includes(listing.id) ? "fill-current" : ""
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center text-gray-500 mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{listing.address}</span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">{listing.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(listing.price)}
                      </span>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-gray-600">
                          <BedDouble className="w-5 h-5" />
                          <span className="text-sm font-medium">{listing.beds}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Bath className="w-5 h-5" />
                          <span className="text-sm font-medium">{listing.baths}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Square className="w-5 h-5" />
                          <span className="text-sm font-medium">{listing.sqft.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <AIVAChat />
    </>
  );
}
