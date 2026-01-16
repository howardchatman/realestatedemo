"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  BedDouble,
  Bath,
  Square,
  MapPin,
  Calendar,
  Home,
  Share2,
  ChevronLeft,
  Phone,
  Mail,
  ArrowRight,
  Check,
  Car,
  Trees,
  Wifi,
  Wind,
  Flame,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIVAChat from "@/components/AIVAChat";
import CallButton from "@/components/CallButton";
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
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    ],
    tag: "New Listing",
    tagColor: "bg-emerald-500",
    type: "House",
    yearBuilt: 2021,
    lotSize: "0.75 acres",
    garage: "3 Car",
    description: "Stunning lakefront estate with panoramic water views. Features include a gourmet kitchen, home theater, and private dock. This exceptional property offers the perfect blend of luxury and natural beauty, with floor-to-ceiling windows that showcase breathtaking lake views from every room.",
    features: [
      "Gourmet Kitchen with Sub-Zero Appliances",
      "Private Dock with Boat Lift",
      "Home Theater with 4K Projection",
      "Wine Cellar (500+ bottle capacity)",
      "Smart Home Technology Throughout",
      "Heated Pool and Spa",
      "3-Car Heated Garage",
      "Primary Suite with Lake View Balcony",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    ],
    tag: "Featured",
    tagColor: "bg-blue-500",
    type: "Condo",
    yearBuilt: 2019,
    lotSize: "N/A",
    garage: "2 Spaces",
    description: "Luxurious penthouse in the heart of downtown. Floor-to-ceiling windows, private terrace, and 24/7 concierge service. Experience urban living at its finest with stunning city skyline views and premium finishes throughout.",
    features: [
      "360° City Views",
      "Private Rooftop Terrace",
      "24/7 Concierge Service",
      "Fitness Center Access",
      "Floor-to-Ceiling Windows",
      "Custom Italian Cabinetry",
      "Heated Bathroom Floors",
      "Building Amenities Include Pool & Spa",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80",
    ],
    tag: "Open House",
    tagColor: "bg-orange-500",
    type: "House",
    yearBuilt: 1985,
    lotSize: "0.5 acres",
    garage: "2 Car",
    description: "Classic colonial charm meets modern updates. Hardwood floors throughout, updated kitchen, and beautifully landscaped yard. This meticulously maintained home offers timeless elegance with all the conveniences of modern living.",
    features: [
      "Original Hardwood Floors",
      "Updated Chef's Kitchen",
      "Formal Living & Dining Rooms",
      "Finished Basement",
      "Professional Landscaping",
      "New Roof (2022)",
      "Central Air Conditioning",
      "Walking Distance to Schools",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
    ],
    tag: "Price Reduced",
    tagColor: "bg-red-500",
    type: "House",
    yearBuilt: 2022,
    lotSize: "0.4 acres",
    garage: "2 Car + EV",
    description: "Fully automated smart home with cutting-edge technology. Solar panels, EV charging, and energy-efficient design. This net-zero ready home represents the future of sustainable luxury living.",
    features: [
      "Full Smart Home Integration",
      "Solar Panel System",
      "Tesla Powerwall Battery",
      "EV Charging Station",
      "Energy Star Appliances",
      "Automated Lighting & Climate",
      "Security System with Cameras",
      "Rainwater Harvesting System",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    ],
    tag: "Luxury",
    tagColor: "bg-purple-500",
    type: "House",
    yearBuilt: 2020,
    lotSize: "1.2 acres",
    garage: "4 Car",
    description: "Breathtaking oceanfront property with direct beach access. Infinity pool, outdoor kitchen, and guest house. This resort-style estate offers unparalleled luxury with the sound of waves as your daily soundtrack.",
    features: [
      "Direct Beach Access",
      "Infinity Edge Pool",
      "Outdoor Kitchen & Dining",
      "Separate Guest House",
      "Private Beach Cabana",
      "Hurricane-Rated Windows",
      "Elevator to All Floors",
      "Whole Home Generator",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80",
    ],
    tag: "New Listing",
    tagColor: "bg-emerald-500",
    type: "House",
    yearBuilt: 2018,
    lotSize: "2 acres",
    garage: "2 Car",
    description: "Peaceful mountain retreat with stunning views. Wood-burning fireplace, wraparound deck, and hiking trails nearby. Escape to nature without sacrificing comfort in this beautifully crafted mountain home.",
    features: [
      "Mountain & Valley Views",
      "Wood-Burning Stone Fireplace",
      "Wraparound Deck",
      "Cathedral Ceilings",
      "Hot Tub",
      "Trail Access from Property",
      "Oversized Windows",
      "Well Water with Filtration",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    ],
    tag: "Featured",
    tagColor: "bg-blue-500",
    type: "Condo",
    yearBuilt: 2017,
    lotSize: "N/A",
    garage: "1 Space",
    description: "Trendy loft in the heart of the arts district. Exposed brick, high ceilings, and rooftop access. Live in the middle of the city's cultural hub with galleries, restaurants, and nightlife at your doorstep.",
    features: [
      "Exposed Brick Walls",
      "14-Foot Ceilings",
      "Oversized Industrial Windows",
      "Rooftop Deck Access",
      "In-Unit Washer/Dryer",
      "Walk-In Closet",
      "Pet Friendly Building",
      "Bike Storage",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
    ],
    tag: "Open House",
    tagColor: "bg-orange-500",
    type: "House",
    yearBuilt: 2015,
    lotSize: "0.35 acres",
    garage: "3 Car",
    description: "Perfect family home in top-rated school district. Large backyard, finished basement, and 3-car garage. This move-in ready home offers everything growing families need.",
    features: [
      "Top-Rated School District",
      "Large Fenced Backyard",
      "Finished Basement with Rec Room",
      "Updated Kitchen",
      "Hardwood Floors Main Level",
      "Community Pool Access",
      "Quiet Cul-de-sac Location",
      "New HVAC System (2023)",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80",
    ],
    tag: "Historic",
    tagColor: "bg-amber-600",
    type: "House",
    yearBuilt: 1895,
    lotSize: "0.6 acres",
    garage: "Carriage House",
    description: "Meticulously restored Victorian with period details. Original woodwork, updated systems, and carriage house. Own a piece of history that has been lovingly maintained and thoughtfully updated.",
    features: [
      "Original Victorian Woodwork",
      "Stained Glass Windows",
      "Updated Electrical & Plumbing",
      "Restored Fireplaces (3)",
      "Carriage House/Workshop",
      "Wrap-Around Porch",
      "Period-Appropriate Updates",
      "Historic Register Eligible",
    ],
  },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ListingDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const listingId = parseInt(resolvedParams.id);
  const listing = allListings.find((l) => l.id === listingId);

  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `I'm interested in ${listing?.title || "this property"}. Please contact me with more information.`,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Lead capture modal state
  const { hasSubmitted, setHasSubmitted } = useLeadCapture();
  const [showLeadModal, setShowLeadModal] = useState(false);

  // Show lead capture modal after a short delay if not already captured
  useEffect(() => {
    if (!hasSubmitted) {
      const timer = setTimeout(() => {
        setShowLeadModal(true);
      }, 2000); // Show after 2 seconds on detail page
      return () => clearTimeout(timer);
    }
  }, [hasSubmitted]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!listing) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h1>
            <p className="text-gray-600 mb-6">The property you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link
              href="/listings"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Listings</span>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would submit to an API
    console.log("Form submitted:", formData);
    setFormSubmitted(true);
    setTimeout(() => {
      setShowContactForm(false);
      setFormSubmitted(false);
    }, 3000);
  };

  // Get similar listings (same type, excluding current)
  const similarListings = allListings
    .filter((l) => l.type === listing.type && l.id !== listing.id)
    .slice(0, 3);

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
        source={`listing_detail_${listingId}`}
      />

      <main className="min-h-screen bg-gray-50 pt-20">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Listings</span>
          </button>
        </div>

        {/* Image Gallery */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Main Image */}
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
              <img
                src={listing.images[selectedImage]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute top-4 left-4 ${listing.tagColor} text-white text-sm font-semibold px-3 py-1 rounded-full`}>
                {listing.tag}
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isFavorite ? "bg-red-500 text-white" : "bg-white text-gray-600 hover:text-red-500"
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? "fill-current" : ""}`} />
                </button>
                <button className="w-12 h-12 rounded-full bg-white text-gray-600 flex items-center justify-center hover:text-emerald-600">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-2 gap-4">
              {listing.images.slice(1, 5).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx + 1)}
                  className={`relative h-[190px] lg:h-[240px] rounded-xl overflow-hidden ${
                    selectedImage === idx + 1 ? "ring-4 ring-emerald-500" : ""
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{listing.address}</span>
                </div>
                <div className="text-4xl font-bold text-emerald-600">{formatPrice(listing.price)}</div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 text-center">
                  <BedDouble className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{listing.beds}</div>
                  <div className="text-sm text-gray-500">Bedrooms</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <Bath className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{listing.baths}</div>
                  <div className="text-sm text-gray-500">Bathrooms</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <Square className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{listing.sqft.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Sq Ft</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <Calendar className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{listing.yearBuilt}</div>
                  <div className="text-sm text-gray-500">Year Built</div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About This Property</h2>
                <p className="text-gray-600 leading-relaxed">{listing.description}</p>
              </div>

              {/* Property Details */}
              <div className="bg-white rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Property Details</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Home className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="text-sm text-gray-500">Property Type</div>
                      <div className="font-medium text-gray-900">{listing.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Trees className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="text-sm text-gray-500">Lot Size</div>
                      <div className="font-medium text-gray-900">{listing.lotSize}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Car className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="text-sm text-gray-500">Garage</div>
                      <div className="font-medium text-gray-900">{listing.garage}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Wind className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="text-sm text-gray-500">Cooling</div>
                      <div className="font-medium text-gray-900">Central Air</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Flame className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="text-sm text-gray-500">Heating</div>
                      <div className="font-medium text-gray-900">Forced Air</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Wifi className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="text-sm text-gray-500">Internet</div>
                      <div className="font-medium text-gray-900">Fiber Available</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Features & Amenities</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {listing.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-white rounded-2xl p-6 sticky top-28">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Interested in this property?</h3>

                {showContactForm ? (
                  formSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-emerald-600" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Message Sent!</h4>
                      <p className="text-gray-600 text-sm">We&apos;ll get back to you shortly.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <textarea
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                        required
                      />
                      <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        Send Message
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowContactForm(false)}
                        className="w-full py-3 text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    </form>
                  )
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowContactForm(true)}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all"
                    >
                      <Mail className="w-5 h-5" />
                      <span>Request Info</span>
                    </button>
                    <a
                      href="tel:+18327707998"
                      className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-gray-200 transition-all"
                    >
                      <Phone className="w-5 h-5" />
                      <span>(832) 770-7998</span>
                    </a>
                    <div className="pt-2">
                      <p className="text-sm text-gray-500 text-center mb-3">Or talk to our AI assistant</p>
                      <CallButton variant="default" className="w-full justify-center" />
                    </div>
                  </div>
                )}
              </div>

              {/* Schedule Tour */}
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Schedule a Tour</h3>
                <p className="text-gray-600 text-sm mb-4">See this home in person. Our agents are available 7 days a week.</p>
                <Link
                  href={`/schedule?propertyId=${listing.id}&address=${encodeURIComponent(listing.address)}`}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-emerald-700 transition-all"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book a Showing</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Similar Listings */}
          {similarListings.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Similar Properties</h2>
                <Link
                  href="/listings"
                  className="flex items-center space-x-2 text-emerald-600 font-semibold hover:text-emerald-700"
                >
                  <span>View All</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {similarListings.map((item) => (
                  <Link
                    key={item.id}
                    href={`/listings/${item.id}`}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group block"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2">
                        <span className="text-xl font-bold text-gray-900">{formatPrice(item.price)}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{item.address}</span>
                      </div>
                      <div className="flex items-center space-x-4 mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
                        <span>{item.beds} beds</span>
                        <span>{item.baths} baths</span>
                        <span>{item.sqft.toLocaleString()} sqft</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <AIVAChat />
    </>
  );
}
