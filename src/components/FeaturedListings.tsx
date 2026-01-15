"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, BedDouble, Bath, Square, MapPin, ArrowRight } from "lucide-react";

const listings = [
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
  },
];

export default function FeaturedListings() {
  const [favorites, setFavorites] = useState<number[]>([]);

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

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Explore our handpicked selection of exceptional homes. Each property has been carefully curated to meet the highest standards.
            </p>
          </div>
          <Link
            href="/listings"
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Listings Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Tag */}
                <div className={`absolute top-4 left-4 ${listing.tagColor} text-white text-sm font-semibold px-3 py-1 rounded-full`}>
                  {listing.tag}
                </div>
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(listing.id)}
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
                {/* Price Overlay */}
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

                {/* View Details Button */}
                <Link
                  href={`/listings/${listing.id}`}
                  className="w-full mt-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-emerald-500 hover:text-white transition-all block text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
