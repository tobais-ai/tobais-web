import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import ServiceCards from "@/components/home/ServiceCards";
import AboutSection from "@/components/home/AboutSection";
import OurProcess from "@/components/home/OurProcess";
import AISolutions from "@/components/home/AISolutions";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import ContactSection from "@/components/home/ContactSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden">
        <Hero />
        <Stats />
        <ServiceCards />
        <OurProcess />
        <AboutSection />
        <AISolutions />
        <FeaturedProjects />
        <Testimonials />
        <FAQ />
        <ContactSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
