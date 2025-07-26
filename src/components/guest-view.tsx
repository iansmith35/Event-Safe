"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";

type Status = 'Green' | 'Amber' | 'Red';

const statusConfig = {
  Green: {
    color: 'bg-chart-2',
    label: 'Green',
    description: 'All clear. You have a good standing.',
  },
  Amber: {
    color: 'bg-chart-4',
    label: 'Amber',
    description: 'Caution. There are some reports on your profile.',
  },
  Red: {
    color: 'bg-destructive',
    label: 'Red',
    description: 'Blocked. You are not permitted entry.',
  },
};

export default function GuestView() {
  const [status] = useState<Status>('Green');

  const currentStatus = statusConfig[status];

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Your Status</CardTitle>
          <CardDescription>Your current traffic light status for event entry.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 pt-2">
          <div className="relative flex items-center justify-center w-48 h-48">
            <div className="absolute w-full h-full rounded-full bg-muted/50 animate-pulse"></div>
            <div className={`w-40 h-40 rounded-full flex items-center justify-center shadow-lg ${currentStatus.color}`}>
              <span className="text-4xl font-bold text-white drop-shadow-md">{currentStatus.label}</span>
            </div>
          </div>
          <p className="text-center text-muted-foreground">{currentStatus.description}</p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Event Pass</CardTitle>
            <CardDescription>Present this QR code for scanning at venue entry.</CardDescription>
          </div>
          <div className="flex items-center gap-4">
             <Avatar>
              <AvatarImage src="https://placehold.co/100x100.png" alt="@guest" data-ai-hint="profile picture" />
              <AvatarFallback>G</AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-6 p-10">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <Image
              src="https://placehold.co/300x300.png"
              alt="QR Code"
              width={300}
              height={300}
              className="rounded-md"
              data-ai-hint="qr code"
            />
          </div>
          <p className="text-sm text-center text-muted-foreground">
            This QR code is unique to you. Do not share it.
          </p>
          <Button>Download Pass</Button>
        </CardContent>
      </Card>
    </div>
  );
}
