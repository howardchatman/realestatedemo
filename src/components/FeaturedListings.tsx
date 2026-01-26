"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, BedDouble, Bath, Square, MapPin, ArrowRight } from "lucide-react";

const listings = [
  // Affordable homes under $500K
  {
    id: 1,
    title: "Starter Home with Charm",
    address: "142 Maple Lane, Riverside",
    price: 285000,
    beds: 3,
    baths: 2,
    sqft: 1450,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80",
    tag: "Great Value",
    tagColor: "bg-green-500",
  },
  {
    id: 2,
    title: "Updated Ranch Style",
    address: "567 Cedar Court, Oakwood",
    price: 325000,
    beds: 3,
    baths: 2,
    sqft: 1650,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
    tag: "Move-In Ready",
    tagColor: "bg-blue-500",
  },
  {
    id: 3,
    title: "Cozy Craftsman Bungalow",
    address: "234 Birch Street, Pine Ridge",
    price: 349000,
    beds: 2,
    baths: 1,
    sqft: 1200,
    image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600&q=80",
    tag: "Charming",
    tagColor: "bg-amber-500",
  },
  {
    id: 4,
    title: "Modern Townhome",
    address: "789 Urban Way, Downtown",
    price: 375000,
    beds: 2,
    baths: 2,
    sqft: 1350,
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&q=80",
    tag: "New Listing",
    tagColor: "bg-emerald-500",
  },
  {
    id: 5,
    title: "Family-Friendly Split Level",
    address: "456 Willow Drive, Riverside",
    price: 389000,
    beds: 4,
    baths: 2,
    sqft: 1800,
    image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&q=80",
    tag: "Spacious",
    tagColor: "bg-indigo-500",
  },
  {
    id: 6,
    title: "Renovated Colonial",
    address: "321 Heritage Lane, Oakwood",
    price: 425000,
    beds: 3,
    baths: 2,
    sqft: 1750,
    image: "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=600&q=80",
    tag: "Updated",
    tagColor: "bg-teal-500",
  },
  {
    id: 7,
    title: "Sunny Corner Lot Home",
    address: "890 Sunset Blvd, Pine Ridge",
    price: 445000,
    beds: 3,
    baths: 2,
    sqft: 1600,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
    tag: "Corner Lot",
    tagColor: "bg-orange-500",
  },
  {
    id: 8,
    title: "Contemporary Condo",
    address: "100 City Center, Unit 405",
    price: 299000,
    beds: 1,
    baths: 1,
    sqft: 850,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
    tag: "Low HOA",
    tagColor: "bg-cyan-500",
  },
  {
    id: 9,
    title: "Brick Traditional",
    address: "555 Oak Park Ave, Riverside",
    price: 465000,
    beds: 4,
    baths: 3,
    sqft: 2100,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    tag: "Classic",
    tagColor: "bg-rose-500",
  },
  {
    id: 10,
    title: "First-Time Buyer Special",
    address: "678 Starter Street, Tech Park",
    price: 275000,
    beds: 2,
    baths: 1,
    sqft: 1100,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
    tag: "Affordable",
    tagColor: "bg-lime-500",
  },
  {
    id: 11,
    title: "Garden District Gem",
    address: "432 Rose Garden Way, Oakwood",
    price: 485000,
    beds: 3,
    baths: 2,
    sqft: 1900,
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80",
    tag: "Beautiful Yard",
    tagColor: "bg-pink-500",
  },
  // Mid-range and luxury homes
  {
    id: 12,
    title: "Modern Lakefront Estate",
    address: "123 Lakeview Drive, Oakwood",
    price: 1250000,
    beds: 5,
    baths: 4,
    sqft: 4200,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80",
    tag: "Luxury",
    tagColor: "bg-purple-500",
  },
  {
    id: 13,
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
    id: 14,
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
    id: 15,
    title: "Beachfront Paradise",
    address: "555 Ocean Boulevard, Beachfront",
    price: 2100000,
    beds: 6,
    baths: 5,
    sqft: 5500,
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80",
    tag: "Waterfront",
    tagColor: "bg-sky-500",
  },
  {
    id: 16,
    title: "Cozy Mountain Retreat",
    address: "888 Pine Ridge Road",
    price: 525000,
    beds: 3,
    baths: 2,
    sqft: 1850,
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80",
    tag: "Mountain Views",
    tagColor: "bg-emerald-500",
  },
  // Commercial Properties - one per area
  {
    id: 17,
    title: "Prime Retail Space",
    address: "1000 Commerce Drive, Downtown",
    price: 750000,
    beds: 0,
    baths: 2,
    sqft: 3500,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    tag: "Retail",
    tagColor: "bg-gray-700",
    isCommercial: true,
    commercialType: "Retail",
  },
  {
    id: 18,
    title: "Industrial Warehouse",
    address: "5500 Industrial Blvd, Tech Park",
    price: 1250000,
    beds: 0,
    baths: 2,
    sqft: 15000,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80",
    tag: "Warehouse",
    tagColor: "bg-slate-600",
    isCommercial: true,
    commercialType: "Warehouse",
  },
  {
    id: 19,
    title: "Luxury Apartment Complex",
    address: "200 Lakeview Circle, Oakwood",
    price: 4500000,
    beds: 0,
    baths: 0,
    sqft: 45000,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    tag: "Multi-Family",
    tagColor: "bg-violet-600",
    isCommercial: true,
    commercialType: "Apartment Building",
    units: 24,
  },
  {
    id: 20,
    title: "Riverside Shopping Center",
    address: "750 River Road, Riverside",
    price: 3200000,
    beds: 0,
    baths: 6,
    sqft: 28000,
    image: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=600&q=80",
    tag: "Shopping Center",
    tagColor: "bg-fuchsia-600",
    isCommercial: true,
    commercialType: "Shopping Center",
  },
  {
    id: 21,
    title: "Class A Office Building",
    address: "100 Executive Plaza, Downtown",
    price: 5800000,
    beds: 0,
    baths: 12,
    sqft: 35000,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80",
    tag: "Office",
    tagColor: "bg-blue-700",
    isCommercial: true,
    commercialType: "Office Building",
  },
  {
    id: 22,
    title: "Turnkey Restaurant",
    address: "888 Oceanfront Walk, Beachfront",
    price: 950000,
    beds: 0,
    baths: 4,
    sqft: 4200,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
    tag: "Restaurant",
    tagColor: "bg-amber-600",
    isCommercial: true,
    commercialType: "Restaurant",
  },
  {
    id: 23,
    title: "Express Car Wash",
    address: "300 Highway 59, Pine Ridge",
    price: 1100000,
    beds: 0,
    baths: 2,
    sqft: 5500,
    image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&q=80",
    tag: "Car Wash",
    tagColor: "bg-cyan-600",
    isCommercial: true,
    commercialType: "Car Wash",
  },
  {
    id: 24,
    title: "Medical Office Building",
    address: "450 Healthcare Way, Riverside",
    price: 2800000,
    beds: 0,
    baths: 8,
    sqft: 12000,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80",
    tag: "Medical",
    tagColor: "bg-red-600",
    isCommercial: true,
    commercialType: "Medical Office",
  },
  {
    id: 25,
    title: "Self-Storage Facility",
    address: "600 Storage Lane, Tech Park",
    price: 1850000,
    beds: 0,
    baths: 1,
    sqft: 25000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    tag: "Storage",
    tagColor: "bg-orange-600",
    isCommercial: true,
    commercialType: "Self-Storage",
  },
  {
    id: 26,
    title: "Gas Station & Convenience",
    address: "1200 Main Highway, Oakwood",
    price: 1650000,
    beds: 0,
    baths: 2,
    sqft: 3200,
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&q=80",
    tag: "Gas Station",
    tagColor: "bg-yellow-600",
    isCommercial: true,
    commercialType: "Gas Station",
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
                  {"isCommercial" in listing && listing.isCommercial ? (
                    <>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Square className="w-5 h-5" />
                        <span className="text-sm font-medium">{listing.sqft.toLocaleString()} sqft</span>
                      </div>
                      {"units" in listing && listing.units ? (
                        <div className="flex items-center space-x-1 text-gray-600">
                          <span className="text-sm font-medium">{listing.units} Units</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Bath className="w-5 h-5" />
                          <span className="text-sm font-medium">{listing.baths} Bath{listing.baths !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1 text-gray-700 font-semibold">
                        <span className="text-sm">{"commercialType" in listing ? listing.commercialType : "Commercial"}</span>
                      </div>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
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
