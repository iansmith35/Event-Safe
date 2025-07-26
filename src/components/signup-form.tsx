"use client";

import { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera, Upload, Check, AlertCircle, CalendarIcon, ShieldQuestion } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { Checkbox } from './ui/checkbox';
import Link from 'next/link';

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [dob, setDob] = useState<Date | undefined>();
  const [consent, setConsent] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Camera API not supported.');
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
    
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }

  }, [toast]);

  const takeSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setSelfie(dataUrl);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelfie(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast({
      title: "Processing Payment...",
      description: "Redirecting to Stripe to complete your £3 signup fee.",
    });
    // Simulate Stripe checkout & ID verification
    setTimeout(() => {
      setIsLoading(false);
      setIsPaid(true);
       toast({
        title: "Payment Successful!",
        description: "Your account is created. Please check your dashboard.",
      });
      // In a real app, you would handle webhooks from Stripe and the ID provider
      // to update Firestore and set the user's status to 'verified'.
    }, 3000);
  };

  if (isPaid) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Verification Pending</CardTitle>
                <CardDescription>Your payment was successful and your ID is being verified.</CardDescription>
            </CardHeader>
            <CardContent className='text-center space-y-4'>
                <p>You will be notified once verification is complete. You can now close this page or return to the dashboard.</p>
                <Button asChild>
                    <Link href="/">Go to Dashboard</Link>
                </Button>
            </CardContent>
        </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>All fields are required to create your secure event pass.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="selfie">Your Selfie</Label>
            <div className="w-full p-2 border-dashed border-2 rounded-lg flex flex-col items-center justify-center gap-4">
              <div className="w-full aspect-video bg-muted rounded-md overflow-hidden relative">
                {selfie ? (
                  <img src={selfie} alt="Selfie preview" className="w-full h-full object-cover" />
                ) : (
                  <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              {hasCameraPermission === false && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Camera Not Available</AlertTitle>
                  <AlertDescription>
                    Camera access is disabled. You can upload a photo instead.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-wrap gap-2 w-full">
                <Button type="button" onClick={takeSelfie} disabled={!hasCameraPermission || !!selfie} className="flex-1">
                  <Camera className="mr-2" /> Take Selfie
                </Button>
                <Button asChild variant="outline" className="flex-1">
                    <label htmlFor="selfie-upload">
                        <Upload className="mr-2" /> Upload Photo
                        <input id="selfie-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                    </label>
                </Button>
              </div>
              {selfie && <p className="text-sm text-chart-2 flex items-center"><Check className="mr-1 h-4 w-4" /> Selfie captured. Looks good!</p>}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Make sure your face is clearly visible, with no filters or obstructions.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pseudonym">Pseudonym</Label>
              <Input id="pseudonym" placeholder="e.g., AgentIndigo" required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dob ? format(dob, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dob}
                    onSelect={setDob}
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={1950}
                    toYear={new Date().getFullYear() - 18}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="safeWord" className="flex items-center gap-1">
                Safe Word <ShieldQuestion className="h-4 w-4 text-muted-foreground" />
              </Label>
              <Input id="safeWord" type="text" required placeholder="For account recovery"/>
            </div>
          </div>
          
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox id="consent" checked={consent} onCheckedChange={(checked) => setConsent(checked as boolean)} />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the terms and conditions
              </label>
              <p className="text-sm text-muted-foreground">
                I consent to the use of my photo and data for verification and security purposes as per the safety policy.
              </p>
            </div>
          </div>

          <Button type="submit" disabled={isLoading || !selfie || !consent || !dob} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Pay £3 and Create Account
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
