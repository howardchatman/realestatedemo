"use client";

import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  Home,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  Search,
  MapPin,
  Bed,
  Bath,
  Square,
  TrendingUp,
  MoreVertical,
} from "lucide-react";

const mockListings = [
  {
    id: 1,
    title: "Modern Lakefront Estate",
    address: "123 Lakeview Drive, Oakwood",
    price: 1250000,
    status: "active",
    views: 1240,
    inquiries: 23,
    daysOnMarket: 12,
    beds: 5,
    baths: 4,
    sqft: 4200,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80",
  },
  {
    id: 2,
    title: "Downtown Luxury Penthouse",
    address: "456 Main Street, Unit PH1",
    price: 895000,
    status: "pending",
    views: 890,
    inquiries: 15,
    daysOnMarket: 8,
    beds: 3,
    baths: 3,
    sqft: 2800,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80",
  },
  {
    id: 3,
    title: "Charming Colonial Home",
    address: "789 Oak Street, Riverside",
    price: 675000,
    status: "active",
    views: 650,
    inquiries: 11,
    daysOnMarket: 21,
    beds: 4,
    baths: 3,
    sqft: 3100,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
  },
  {
    id: 4,
    title: "Contemporary Smart Home",
    address: "321 Tech Park Lane",
    price: 785000,
    status: "sold",
    views: 1100,
    inquiries: 28,
    daysOnMarket: 15,
    beds: 4,
    baths: 3,
    sqft: 3400,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80",
  },
  {
    id: 5,
    title: "Beachfront Villa",
    address: "555 Ocean Drive, Coastal Bay",
    price: 2150000,
    status: "active",
    views: 2300,
    inquiries: 45,
    daysOnMarket: 5,
    beds: 6,
    baths: 5,
    sqft: 5500,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80",
  },
  {
    id: 6,
    title: "Mountain View Cabin",
    address: "101 Pine Ridge Road",
    price: 425000,
    status: "active",
    views: 380,
    inquiries: 8,
    daysOnMarket: 30,
    beds: 3,
    baths: 2,
    sqft: 1800,
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&q=80",
  },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Active</span>;
    case "pending":
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Pending</span>;
    case "sold":
      return <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">Sold</span>;
    default:
      return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{status}</span>;
  }
};

export default function ListingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredListings = mockListings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockListings.length,
    active: mockListings.filter(l => l.status === "active").length,
    pending: mockListings.filter(l => l.status === "pending").length,
    sold: mockListings.filter(l => l.status === "sold").length,
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Property Listings</h1>
        <p className="text-gray-500 mt-1">Manage your property listings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Listings</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-purple-600">{stats.sold}</p>
              <p className="text-sm text-gray-500">Sold</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-100 mb-6">
        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Listing</span>
            </button>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <div key={listing.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 left-3">
                {getStatusBadge(listing.status)}
              </div>
              <div className="absolute top-3 right-3">
                <button className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {listing.address}
                  </div>
                </div>
              </div>
              <p className="text-xl font-bold text-emerald-600 mb-3">{formatPrice(listing.price)}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  <span>{listing.beds} beds</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  <span>{listing.baths} baths</span>
                </div>
                <div className="flex items-center gap-1">
                  <Square className="w-4 h-4" />
                  <span>{listing.sqft.toLocaleString()} sqft</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{listing.views}</span>
                  </div>
                  <span>{listing.daysOnMarket} days</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
