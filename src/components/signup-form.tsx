
"use client";

import { useRef, useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera, Upload, Check, AlertCircle, CalendarIcon, ShieldQuestion, UserCheck, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { Checkbox } from './ui/checkbox';
import Link from 'next/link';
import { checkDuplicateGuest, type CheckDuplicateGuestOutput } from '@/ai/flows/check-duplicate-guest';
import { Textarea } from './ui/textarea';
import CheckoutNotices from './CheckoutNotices';

function SignupFormComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [dob, setDob] = useState<Date | undefined>();
  const [consent, setConsent] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [duplicateCheckResult, setDuplicateCheckResult] = useState<CheckDuplicateGuestOutput | null>(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
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
  
  const runDuplicateCheck = async (selfieDataUrl: string) => {
    if (!dob) {
        toast({ variant: "destructive", title: "Please select your date of birth first."});
        return;
    }
    setIsCheckingDuplicate(true);
    setDuplicateCheckResult(null);
    try {
        const result = await checkDuplicateGuest({ selfieDataUri: selfieDataUrl, dob: dob.toISOString() });
        setDuplicateCheckResult(result);
        if (result.isPotentialDuplicate) {
             toast({
                variant: "destructive",
                title: "Potential Duplicate Account",
                description: "Your account has been flagged for manual review. You can still proceed.",
             });
        }
    } catch (error) {
        console.error("Duplicate check failed:", error);
        toast({ variant: "destructive", title: "Could not complete duplicate check." });
    } finally {
        setIsCheckingDuplicate(false);
    }
  }

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
        runDuplicateCheck(dataUrl);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setSelfie(dataUrl);
        runDuplicateCheck(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      toast({
          title: "Processing Signup...",
          description: "Finalizing your account details.",
      });

      // Simulate network request
      setTimeout(() => {
          setIsLoading(false);
          setIsSignedUp(true);
          toast({
              title: "Signup Complete!",
              description: "Your account is now pending verification.",
          });
      }, 1500)
  }

  if (isSignedUp) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Verification Pending</CardTitle>
                <CardDescription>Your signup was successful and your ID is being verified.</CardDescription>
            </CardHeader>
            <CardContent className='text-center space-y-4'>
                 {duplicateCheckResult?.isPotentialDuplicate && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Account Flagged</AlertTitle>
                        <AlertDescription>
                            Your account requires manual review before it can be fully activated due to a potential policy conflict. You will be notified of the outcome.
                        </AlertDescription>
                    </Alert>
                )}
                <p>You will be notified once verification is complete. You can now close this page or return to the dashboard.</p>
                <Button asChild>
                    <Link href="/dashboard">Go to Dashboard</Link>
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
        <form onSubmit={handleSignup} className="space-y-6">
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
                <Button type="button" onClick={takeSelfie} disabled={!hasCameraPermission || !!selfie || !dob} className="flex-1">
                  <Camera className="mr-2" /> Take Selfie
                </Button>
                <Button asChild variant="outline" className="flex-1" disabled={!dob}>
                    <label htmlFor="selfie-upload">
                        <Upload className="mr-2" /> Upload Photo
                        <input id="selfie-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                    </label>
                </Button>
              </div>
              {selfie && !isCheckingDuplicate && !duplicateCheckResult && <p className="text-sm text-chart-2 flex items-center"><Check className="mr-1 h-4 w-4" /> Selfie captured. Looks good!</p>}
              {isCheckingDuplicate && <p className="text-sm text-muted-foreground flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Running security checks...</p>}
              {duplicateCheckResult && (
                <Alert variant={duplicateCheckResult.isPotentialDuplicate ? "destructive" : "default"} className="text-left">
                    {duplicateCheckResult.isPotentialDuplicate ? <AlertCircle className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    <AlertTitle>
                        {duplicateCheckResult.isPotentialDuplicate ? "Potential Duplicate Detected" : "Security Check Passed"}
                    </AlertTitle>
                    <AlertDescription>
                        {duplicateCheckResult.reason}
                    </AlertDescription>
                </Alert>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Make sure your face is clearly visible, with no filters or obstructions. You must select your date of birth before providing a selfie.</p>
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
                    disabled={!!selfie}
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

           <div className="space-y-4 p-4 border rounded-lg">
                <div className='space-y-2'>
                    <Label className='flex items-center gap-2'><Info className="h-4 w-4" /> Distinguishing Mark (Optional, High Security)</Label>
                    <p className='text-xs text-muted-foreground'>For high-security verification in edge cases (e.g., identical twins), you can register a non-facial mark like a tattoo or birthmark.</p>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="mark-description">Mark Description</Label>
                    <Input id="mark-description" placeholder="e.g., Rose tattoo, Small mole" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="mark-location">Mark Location</Label>
                    <Input id="mark-location" placeholder="e.g., Left forearm, Right shoulder blade" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="mark-photo">Photo of Mark (Optional)</Label>
                    <Button asChild variant="outline" className="w-full">
                        <label htmlFor="mark-upload">
                            <Upload className="mr-2" /> Upload Photo
                            <input id="mark-upload" type="file" accept="image/*" className="sr-only" />
                        </label>
                    </Button>
                </div>
            </div>
          
          <div className="flex items-start space-x-3 pt-2">
            <Checkbox id="consent" checked={consent} onCheckedChange={(checked) => setConsent(checked as boolean)} className="mt-1" />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the EventSafe <Link href="/legal" className="underline">terms and conditions</Link>.
              </label>
              <p className="text-sm text-muted-foreground">
                 I consent to the use of my biometric data for identity verification and fraud prevention. I understand my data may be retained for up to 12 months after account deletion for security purposes and that event data may be temporarily cached on staff devices for offline verification.
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
              <Label htmlFor="promo-code">Promo Code</Label>
              <Input id="promo-code" placeholder="Enter discount code" />
          </div>
          
          <div className="space-y-2">
              <Label htmlFor="referral-code">Referred by (Pseudonym)</Label>
              <Input id="referral-code" placeholder="Enter the pseudonym of the person who referred you" />
          </div>

          <Button type="submit" disabled={isLoading || !selfie || !consent || !dob || isCheckingDuplicate} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Complete Signup (Simulate Payment)'}
          </Button>
          <CheckoutNotices />
        </form>
      </CardContent>
    </Card>
  );
}

// React Suspense is required for useSearchParams, so we wrap the component
export default function SignupForm() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignupFormComponent />
        </Suspense>
    )
}
