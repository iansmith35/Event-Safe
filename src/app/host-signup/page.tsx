
import HostSignupForm from "@/components/host-signup-form";
import { Logo } from "@/components/logo";

export default function HostSignupPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col items-center mb-6">
           <Logo className="w-auto h-12 text-primary mb-4" />
          <h1 className="text-3xl font-bold">Become an EventSafe Host</h1>
          <p className="text-muted-foreground mt-2 text-center">Create your venue profile to start hosting secure events.</p>
        </div>
        <HostSignupForm />
      </div>
    </div>
  );
}
