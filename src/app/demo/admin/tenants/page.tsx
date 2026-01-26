"use client";

import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  Building,
  Search,
  Plus,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Edit,
  MoreVertical,
  User,
} from "lucide-react";

const mockTenants = [
  { id: "t1", name: "Marcus Johnson", email: "mjohnson@email.com", phone: "(555) 111-2222", property: "456 Riverside Dr, Unit 3A", rent: 1850, leaseStart: "2024-09-01", leaseEnd: "2025-08-31", status: "active" },
  { id: "t2", name: "Lisa Chen", email: "lchen@email.com", phone: "(555) 333-4444", property: "789 Oakwood Lane, Unit 2B", rent: 2100, leaseStart: "2024-07-01", leaseEnd: "2025-06-30", status: "active" },
  { id: "t3", name: "David Williams", email: "dwilliams@email.com", phone: "(555) 555-6666", property: "123 Downtown Plaza, Unit 5C", rent: 2450, leaseStart: "2025-01-01", leaseEnd: "2025-12-31", status: "active" },
  { id: "t4", name: "Sarah Miller", email: "smiller@email.com", phone: "(555) 777-8888", property: "321 Tech Park Ave, Unit 1A", rent: 1950, leaseStart: "2024-05-01", leaseEnd: "2025-04-30", status: "active" },
  { id: "t5", name: "James Rodriguez", email: "jrodriguez@email.com", phone: "(555) 999-0000", property: "555 Beachfront Blvd, Unit 4D", rent: 2800, leaseStart: "2024-10-01", leaseEnd: "2025-09-30", status: "active" },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getDaysUntilLeaseEnd = (leaseEnd: string) => {
  const end = new Date(leaseEnd);
  const now = new Date();
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
};

export default function TenantsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTenants = mockTenants.filter((tenant) =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.property.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRent = mockTenants.reduce((sum, t) => sum + t.rent, 0);

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tenant Management</h1>
        <p className="text-gray-500 mt-1">Manage your property tenants</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{mockTenants.length}</p>
              <p className="text-sm text-gray-500">Total Tenants</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalRent)}</p>
              <p className="text-sm text-gray-500">Monthly Rent</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">{mockTenants.filter(t => t.status === "active").length}</p>
              <p className="text-sm text-gray-500">Active Leases</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-orange-600">{mockTenants.filter(t => getDaysUntilLeaseEnd(t.leaseEnd) < 90).length}</p>
              <p className="text-sm text-gray-500">Expiring Soon</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-xl border border-gray-100 mb-6">
        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tenants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Tenant</span>
          </button>
        </div>
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTenants.map((tenant) => {
          const daysLeft = getDaysUntilLeaseEnd(tenant.leaseEnd);
          const isExpiringSoon = daysLeft < 90;

          return (
            <div key={tenant.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {tenant.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{tenant.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      tenant.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {tenant.status}
                    </span>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span>{tenant.property}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{tenant.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{tenant.phone}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Monthly Rent</span>
                  <span className="font-semibold text-emerald-600">{formatCurrency(tenant.rent)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Lease Ends</span>
                  <span className={`text-sm font-medium ${isExpiringSoon ? "text-orange-600" : "text-gray-700"}`}>
                    {formatDate(tenant.leaseEnd)}
                    {isExpiringSoon && <span className="ml-1">({daysLeft} days)</span>}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-600">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </button>
                <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-600">
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </button>
                <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-600">
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
