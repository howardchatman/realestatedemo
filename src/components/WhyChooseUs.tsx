"use client";

import { Clock, Users, Award, HeartHandshake, Phone, MessageSquare } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "Our team is available around the clock. Call or message anytime and get an instant response.",
    stat: "Always On",
  },
  {
    icon: Users,
    title: "Expert Local Agents",
    description:
      "Work with agents who know your neighborhood inside and out. Local expertise you can trust.",
    stat: "15+ Years Exp",
  },
  {
    icon: Award,
    title: "Award-Winning Service",
    description:
      "Recognized as the top real estate team in the region for exceptional client satisfaction.",
    stat: "#1 Rated",
  },
  {
    icon: HeartHandshake,
    title: "Personalized Approach",
    description:
      "Every client gets a customized experience tailored to their unique needs and preferences.",
    stat: "100% Personal",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Why Choose <span className="text-emerald-400">Chatman Real Estate</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            We combine cutting-edge technology with personalized service to deliver an exceptional real estate experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <div className="text-emerald-400 text-sm font-semibold mb-2">
                {feature.stat}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-white/60">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Find Your Dream Home?
              </h3>
              <p className="text-white/70 mb-6">
                Our AI assistant is available 24/7 to answer your questions and help you schedule a showing. Get started today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:+15551234567"
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call Us Now</span>
                </a>
                <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-all">
                  <MessageSquare className="w-5 h-5" />
                  <span>Chat with AIVA</span>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-end">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/10 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-white mb-1">2,500+</div>
                  <div className="text-white/60">Homes Sold</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-white mb-1">98%</div>
                  <div className="text-white/60">Client Satisfaction</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-white mb-1">15+</div>
                  <div className="text-white/60">Years Experience</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-white mb-1">24/7</div>
                  <div className="text-white/60">Availability</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
