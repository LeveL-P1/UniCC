import { PageContainer } from "@/components/layout/PageContainer";
import { FeaturedProfilesGrid } from "@/components/landing/FeaturedProfilesGrid";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingCTA } from "@/components/landing/LandingCTA";
import { PlatformStrip } from "@/components/landing/PlatformStrip";

export default function LandingPage() {
  return (
    <PageContainer>
      <HeroSection />
      <PlatformStrip />
      <HowItWorks />
      <FeaturedProfilesGrid />
      <LandingCTA />
    </PageContainer>
  );
}
