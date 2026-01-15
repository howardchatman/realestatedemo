"use client";

import Link from "next/link";
import {
  Users,
  Award,
  Heart,
  Home,
  Phone,
  Mail,
  ArrowRight,
  Star,
  TrendingUp,
  Shield,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIVAChat from "@/components/AIVAChat";

const stats = [
  { icon: Home, value: "500+", label: "Properties Sold" },
  { icon: Users, value: "1,200+", label: "Happy Clients" },
  { icon: TrendingUp, value: "$2.5B", label: "Total Sales Volume" },
  { icon: Award, value: "15+", label: "Years Experience" },
];

const team = [
  {
    name: "Howard Chatman",
    role: "Founder & Principal Broker",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    bio: "With over 15 years in real estate, Howard founded Chatman Real Estate with a vision to revolutionize the home buying experience through technology and personalized service.",
  },
  {
    name: "Sarah Mitchell",
    role: "Senior Sales Agent",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    bio: "Sarah specializes in luxury properties and has consistently been a top performer, helping families find their dream homes for over a decade.",
  },
  {
    name: "Michael Chen",
    role: "Technology Director",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    bio: "Michael leads our AI initiatives, including AIVA, ensuring our clients have access to cutting-edge tools for their real estate journey.",
  },
  {
    name: "Emily Rodriguez",
    role: "Client Success Manager",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    bio: "Emily ensures every client receives exceptional service from first contact to closing day and beyond.",
  },
];

const values = [
  {
    icon: Heart,
    title: "Client-First Approach",
    description: "Every decision we make is centered around providing the best possible experience for our clients.",
  },
  {
    icon: Shield,
    title: "Trust & Transparency",
    description: "We believe in honest communication and complete transparency throughout the entire process.",
  },
  {
    icon: Star,
    title: "Excellence in Service",
    description: "We hold ourselves to the highest standards, continuously improving to serve you better.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description: "We embrace technology to make real estate transactions smoother, faster, and more accessible.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-emerald-600 to-teal-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">About Chatman Real Estate</h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                We&apos;re more than just real estate agents. We&apos;re your partners in finding the perfect place to call home, powered by innovation and driven by your success.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Founded in 2009, Chatman Real Estate began with a simple mission: to make the home buying and selling experience better for everyone involved.
                  </p>
                  <p>
                    What started as a small team with big dreams has grown into one of the most trusted real estate agencies in the region. We&apos;ve helped over 1,200 families find their perfect homes, and we&apos;re just getting started.
                  </p>
                  <p>
                    In 2024, we introduced AIVA, our AI-powered virtual assistant, marking a new chapter in how we serve our clients. Available 24/7, AIVA represents our commitment to being there whenever you need us.
                  </p>
                  <p>
                    But no matter how much we grow or how advanced our technology becomes, our core values remain the same: put clients first, be honest and transparent, and never stop improving.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
                  alt="Modern office"
                  className="rounded-2xl shadow-xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-emerald-500 text-white rounded-xl p-6 shadow-lg">
                  <div className="text-3xl font-bold">15+</div>
                  <div className="text-emerald-100">Years of Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                These principles guide everything we do, from how we interact with clients to how we build our technology.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                    <value.icon className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our experienced team is dedicated to providing exceptional service and expertise to help you achieve your real estate goals.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, idx) => (
                <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-lg group">
                  <div className="h-64 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                    <p className="text-emerald-600 text-sm font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Whether you&apos;re buying, selling, or just exploring, we&apos;re here to help every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/listings"
                className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>Browse Listings</span>
              </Link>
              <Link
                href="/#contact"
                className="px-8 py-4 bg-emerald-700 text-white rounded-xl font-semibold hover:bg-emerald-800 transition-all flex items-center space-x-2"
              >
                <Phone className="w-5 h-5" />
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AIVAChat />
    </>
  );
}
