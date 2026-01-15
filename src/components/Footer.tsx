"use client";

import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import Link from "next/link";

const footerLinks = {
  buying: [
    { name: "Search Homes", href: "/listings" },
    { name: "Featured Properties", href: "/#featured" },
    { name: "New Listings", href: "/listings?filter=new" },
    { name: "Open Houses", href: "/listings?filter=openhouse" },
    { name: "First Time Buyers", href: "/listings" },
  ],
  selling: [
    { name: "Free Home Valuation", href: "/#valuation" },
    { name: "Selling Process", href: "/#valuation" },
    { name: "Market Analysis", href: "/#valuation" },
    { name: "Pricing Strategy", href: "/#valuation" },
    { name: "Home Staging Tips", href: "/#contact" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Team", href: "/about#team" },
    { name: "Testimonials", href: "/#testimonials" },
    { name: "Contact Us", href: "/#contact" },
    { name: "Careers", href: "/about" },
  ],
  resources: [
    { name: "Mortgage Calculator", href: "/#contact" },
    { name: "Buying Guide", href: "/listings" },
    { name: "Selling Guide", href: "/#valuation" },
    { name: "Blog", href: "/about" },
    { name: "FAQ", href: "/#contact" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">C</span>
              </div>
              <div>
                <span className="font-bold text-xl text-white">Chatman</span>
                <span className="font-light text-xl text-emerald-400"> Real Estate</span>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 max-w-xs">
              Your trusted partner in finding the perfect home. Available 24/7 with AI-powered assistance.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="tel:+18327707998"
                className="flex items-center space-x-3 text-gray-400 hover:text-emerald-400 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>(832) 770-7998</span>
              </a>
              <a
                href="mailto:hello@chatmanrealestate.com"
                className="flex items-center space-x-3 text-gray-400 hover:text-emerald-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>hello@chatmanrealestate.com</span>
              </a>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-5 h-5" />
                <span>123 Main Street, Oakwood, CA</span>
              </div>
            </div>
          </div>

          {/* Buying Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Buying</h4>
            <ul className="space-y-3">
              {footerLinks.buying.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Selling Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Selling</h4>
            <ul className="space-y-3">
              {footerLinks.selling.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-semibold text-white mb-1">Get New Listings First</h4>
              <p className="text-gray-400 text-sm">Subscribe to receive the latest properties in your inbox.</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-r-xl font-semibold hover:shadow-lg transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex flex-col md:flex-row items-center gap-2 text-gray-400 text-sm">
              <span>© {new Date().getFullYear()} Chatman Real Estate. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <div className="flex items-center gap-4">
                <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
