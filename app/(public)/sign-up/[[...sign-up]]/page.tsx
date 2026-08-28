import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/layout/AuthShell";

export const metadata = { title: "Create profile" };

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your profile"
      description="Link your handles once. UNICC keeps the numbers current from there."
    >
      <SignUp routing="path" path="/sign-up" forceRedirectUrl="/dashboard" />
    </AuthShell>
  );
}
