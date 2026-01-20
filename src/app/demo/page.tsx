"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Settings, Home } from "lucide-react";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/platform-access">
              <span className="text-2xl font-bold text-white">Chatman RP</span>
            </Link>
            <Link
              href="/platform-access"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Back to Platform Access
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              See Chatman RP in Action
            </h1>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Explore the platform from two perspectives: as a homebuyer browsing
              listings, or as an agent managing leads in the admin dashboard.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* User Demo Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link href="/listings" className="block group">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-300">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:bg-emerald-500/30 transition-colors">
                    <Home className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    Browse Listings
                  </h2>
                  <p className="text-gray-400 mb-6">
                    Experience the platform as a homebuyer. Search properties, chat
                    with AIVA, and see how leads are captured.
                  </p>
                  <div className="flex items-center justify-center text-emerald-400 font-semibold group-hover:text-emerald-300">
                    <span>View Demo</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Admin Demo Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link href="/demo/admin" className="block group">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-300">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:bg-emerald-500/30 transition-colors">
                    <Settings className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    Agent Dashboard
                  </h2>
                  <p className="text-gray-400 mb-6">
                    See how agents manage leads, view conversations, and track
                    their pipeline with Chatman RP.
                  </p>
                  <div className="flex items-center justify-center text-emerald-400 font-semibold group-hover:text-emerald-300">
                    <span>View Dashboard</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-gray-500 mt-12 text-sm"
          >
            This is a demo environment with sample data. Apply for platform access
            to get started with your own account.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
