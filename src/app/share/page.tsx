"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReferralTools from "@/components/ReferralTools";
import { Users, TrendingUp, Gift, Heart } from "lucide-react";

export default function SharePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Share & Help Others Find Home
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Know someone looking to buy or sell? Share this app with friends and
              family to help them find their perfect home.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Gift className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Free Access</h3>
              <p className="text-sm text-gray-600">
                Everyone you share with gets full access to all listings and our AI
                assistant at no cost.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Real-Time Listings</h3>
              <p className="text-sm text-gray-600">
                Your friends will see the latest properties the moment they hit the
                market.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Personal Touch</h3>
              <p className="text-sm text-gray-600">
                They&apos;ll be connected with our expert team who truly cares about
                finding the right home.
              </p>
            </div>
          </div>

          {/* Referral Tools */}
          <ReferralTools />

          {/* Testimonial */}
          <div className="mt-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white text-center">
            <p className="text-xl italic mb-4">
              &quot;I shared this app in my neighborhood group chat and three of my
              neighbors ended up finding their dream homes through it!&quot;
            </p>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold">
                MR
              </div>
              <div className="text-left">
                <p className="font-semibold">Michael Rodriguez</p>
                <p className="text-white/80 text-sm">Houston, TX</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
