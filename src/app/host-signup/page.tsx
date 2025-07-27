
import HostSignupForm from "@/components/host-signup-form";
import { ShieldCheck } from "lucide-react";

export default function HostSignupPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 rounded-lg bg-primary text-primary-foreground mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold">Become an EventSafe Host</h1>
          <p className="text-muted-foreground mt-2 text-center">Create your venue profile to start hosting secure events.</p>
        </div>
        <HostSignupForm />
      </div>
    </div>
  );
}
