import { HeroSection } from "@/components/landing/HeroSection";
import { PlatformRow } from "@/components/landing/PlatformRow";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { ShowcaseSection } from "@/components/landing/ShowcaseSection";
import { ProofSection } from "@/components/landing/ProofSection";
import { LandingCTA } from "@/components/landing/LandingCTA";
import { ContactSection } from "@/components/landing/ContactSection";

/**
 * Rhythm: dramatic visual -> quiet band -> dense functional grid ->
 * full-bleed expansion -> quiet stats -> close.
 */
export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <PlatformRow />
      <FeatureCards />
      <ShowcaseSection />
      <ProofSection />
      <LandingCTA />
      <ContactSection />
    </>
  );
}
