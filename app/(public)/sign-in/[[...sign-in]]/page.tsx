import { SignIn } from "@clerk/nextjs";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionCard } from "@/components/ui/SectionCard";

export default function SignInPage() {
  return (
    <PageContainer className="py-10">
      <SectionCard className="mx-auto max-w-md p-6">
        <SignIn routing="path" path="/sign-in" forceRedirectUrl="/dashboard" />
      </SectionCard>
    </PageContainer>
  );
}

