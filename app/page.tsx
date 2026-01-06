import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { FeatureCards } from "@/components/home/FeatureCards";

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-coral-500/20">
      <Header />
      <HeroSection />
      <FeatureCards />
    </main>
  );
}