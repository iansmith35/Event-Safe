
import SignupForm from "@/components/signup-form";
import { Logo } from "@/components/logo";
import React from 'react';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Logo className="w-auto h-12 text-primary mb-4" />
          <h1 className="text-3xl font-bold text-center">Create your EventSafe Account</h1>
          <p className="text-muted-foreground mt-2 text-center">Join to get your secure event pass.</p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
