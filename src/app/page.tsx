export const revalidate = 0;

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedListings from "@/components/FeaturedListings";
import HomeValuation from "@/components/HomeValuation";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import AIVAChat from "@/components/AIVAChat";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedListings />
      <HomeValuation />
      <WhyChooseUs />
      <Testimonials />
      <ContactSection />
      <Footer />
      <AIVAChat />
    </main>
  );
}
