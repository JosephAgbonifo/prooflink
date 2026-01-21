import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import LiveFeed from "@/components/home/proof";
import DeveloperCTA from "@/components/home/developer-cta"; // New
import FaqSection from "@/components/home/faq"; // New

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Impactful Entrance */}
      <Hero />

      {/* 2. Technical Validation */}
      {/* <LiveFeed /> */}

      {/* 3. Deep Dive into Protocol */}
      <Features />

      {/* 4. Bridging to Builders */}
      <DeveloperCTA />

      {/* 5. Addressing Friction */}
      <FaqSection />
    </main>
  );
}
