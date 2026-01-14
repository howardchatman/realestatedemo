"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah & Michael Johnson",
    type: "First-Time Buyers",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    quote:
      "The team at Chatman Real Estate made buying our first home a breeze. Their 24/7 availability meant we never missed an opportunity. The AI assistant answered our questions instantly, even at midnight!",
    location: "Purchased in Oak Park",
    rating: 5,
  },
  {
    id: 2,
    name: "Robert Chen",
    type: "Seller",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    quote:
      "I got an instant home valuation that was spot-on. Within two weeks, I had multiple offers above asking price. The scheduling tool made showing coordination effortless.",
    location: "Sold in Downtown",
    rating: 5,
  },
  {
    id: 3,
    name: "Jennifer Martinez",
    type: "Investor",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    quote:
      "As a real estate investor, I need quick responses and reliable data. Chatman delivers on both. I've purchased 5 properties through them in the past year alone.",
    location: "Multiple Properties",
    rating: 5,
  },
  {
    id: 4,
    name: "David Thompson",
    type: "Relocating Family",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    quote:
      "Moving across the country with three kids was daunting. The virtual tours and instant chat support meant we could house-hunt from 2,000 miles away. Found our dream home without a single in-person visit!",
    location: "Purchased in Riverside",
    rating: 5,
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real stories from real clients who found their perfect home with us.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden max-w-4xl mx-auto">
          <div className="p-8 md:p-12">
            <Quote className="w-12 h-12 text-emerald-200 mb-6" />

            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8">
              &ldquo;{current.quote}&rdquo;
            </p>

            {/* Rating */}
            <div className="flex items-center space-x-1 mb-6">
              {[...Array(current.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>

            {/* Author */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{current.name}</h4>
                  <p className="text-gray-500">
                    {current.type} • {current.location}
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={prevTestimonial}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-emerald-100 hover:text-emerald-600 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-emerald-100 hover:text-emerald-600 flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-gray-100">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / testimonials.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Testimonial Dots */}
        <div className="flex justify-center space-x-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-emerald-500 w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
