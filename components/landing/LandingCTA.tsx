import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/SectionCard";

export function LandingCTA() {
  return (
    <SectionCard className="my-10 text-center">
      <h2 className="text-2xl font-semibold">Ready to share your CP journey?</h2>
      <p className="mt-2 text-lg ">Connect your profiles and generate a single public page.</p>
      <Button asChild className="mt-5">
        <Link href="/sign-up">Create Your Profile</Link>
      </Button>
    </SectionCard>
  );
}
