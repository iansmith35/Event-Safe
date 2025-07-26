"use client";

import { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera, Upload, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [selfie, setSelfie] = useState<string | null>(null);
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
    // Handle form submission logic here
    console.log("Form submitted");
    setTimeout(() => setIsLoading(false), 2000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>All fields are required to create your account.</CardDescription>
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
          
          <div className="space-y-2">
            <Label htmlFor="pseudonym">Pseudonym</Label>
            <Input id="pseudonym" placeholder="e.g., AgentIndigo" required />
            <p className="text-xs text-muted-foreground">This name will be public on your pass. It must be unique.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>

          <Button type="submit" disabled={isLoading || !selfie} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account & Proceed to Payment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
