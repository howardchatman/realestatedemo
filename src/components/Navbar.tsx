"use client";

import { useState, useEffect } from "react";
import { Menu, X, Phone, Search, Heart } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Buy", href: "/listings" },
    { name: "Sell", href: "#valuation" },
    { name: "Home Value", href: "#valuation" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-lg"
          : "bg-white/95 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-xl text-gray-900">Chatman</span>
              <span className="font-light text-xl text-emerald-600"> Real Estate</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-600 font-medium hover:text-emerald-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
              <Heart className="w-5 h-5" />
            </button>
            <a
              href="tel:+15551234567"
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">(555) 123-4567</span>
            </a>
            <a
              href="#contact"
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
            >
              Schedule Showing
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white rounded-2xl shadow-xl mt-2 p-6 absolute left-4 right-4 border border-gray-100">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 hover:text-emerald-600 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <hr className="my-2" />
              <a
                href="tel:+15551234567"
                className="flex items-center space-x-2 text-gray-600 py-2"
              >
                <Phone className="w-4 h-4" />
                <span className="font-medium">(555) 123-4567</span>
              </a>
              <a
                href="#contact"
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium"
              >
                Schedule Showing
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
