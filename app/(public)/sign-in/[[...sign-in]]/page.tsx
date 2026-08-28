import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/layout/AuthShell";

export const metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in"
      description="Pick up where your last sync left off."
    >
      <SignIn routing="path" path="/sign-in" forceRedirectUrl="/dashboard" />
    </AuthShell>
  );
}
