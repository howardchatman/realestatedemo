export const revalidate = 0;

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import InteractiveDemo from "@/components/InteractiveDemo";
import FeaturedListings from "@/components/FeaturedListings";
import HomeValuation from "@/components/HomeValuation";
import WhyChooseUs from "@/components/WhyChooseUs";
import ProductTourCards from "@/components/ProductTourCards";
import Testimonials from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import AIVAChat from "@/components/AIVAChat";
import LeadCaptureWrapper from "@/components/LeadCaptureWrapper";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <LeadCaptureWrapper delay={5000} source="landing_page" />
      <Hero />
      <InteractiveDemo />
      <FeaturedListings />
      <HomeValuation />
      <WhyChooseUs />
      <ProductTourCards />
      <Testimonials />
      <ContactSection />
      <Footer />
      <AIVAChat />
    </main>
  );
}
