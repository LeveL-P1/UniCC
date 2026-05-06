import { SignUp } from "@clerk/nextjs";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionCard } from "@/components/ui/SectionCard";

export default function SignUpPage() {
  return (
    <PageContainer className="py-10">
      <SectionCard className="mx-auto max-w-md p-6">
        <SignUp routing="path" path="/sign-up" />
      </SectionCard>
    </PageContainer>
  );
}

