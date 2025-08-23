"use client";


import HostSignupForm from "@/components/host-signup-form";
import { Logo } from "@/components/logo";
import Link from "next/link";
import React from 'react';

export default function HostSignupPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col items-center mb-6">
          <Logo className="w-auto h-12 text-primary mb-4" />
          <h1 className="text-3xl font-bold text-center">Become an EventSafe Host</h1>
          <p className="text-muted-foreground mt-2 text-center max-w-xl">
            Register your venue and gain access to powerful tools for managing event safety, staff, and guest lists.
          </p>
        </div>
        <HostSignupForm />
         <div className="mt-4 text-center text-sm">
          Are you a guest?{' '}
          <Link href="/signup" className="underline">
            Create a guest account
          </Link>
        </div>
      </div>
    </div>
  );
}
