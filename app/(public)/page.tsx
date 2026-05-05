import { PageContainer } from "@/components/layout/PageContainer";
import { HeroSection } from "@/components/landing/HeroSection";
import { BentoFeatures } from "@/components/landing/BentoFeatures";
import { LandingCTA } from "@/components/landing/LandingCTA";
import { ContactSection } from "@/components/landing/ContactSection";

export default function LandingPage() {
  return (
    <PageContainer>
      <HeroSection />
      <BentoFeatures />
      <LandingCTA />
      <ContactSection />
    </PageContainer>
  );
}
