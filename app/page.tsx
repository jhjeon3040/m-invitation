import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { PreviewSection } from "@/components/home/PreviewSection";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { CTASection } from "@/components/home/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <PreviewSection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </main>
  );
}
