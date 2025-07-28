
"use client";

import { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, Check, Loader2 } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { Logo } from './logo';

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;

export default function ProfileBadgeGenerator() {
  const [baseImage, setBaseImage] = useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [includeQrCode, setIncludeQrCode] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setBaseImage(img);
          setIsLoading(false);
          toast({ title: "Image loaded", description: "You can now generate your badge." });
        };
        img.onerror = () => {
          setIsLoading(false);
          toast({ variant: "destructive", title: "Error", description: "Failed to load image." });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const generateBadge = async () => {
    if (!baseImage || !canvasRef.current) {
      toast({ variant: "destructive", title: "No image loaded", description: "Please upload an image first." });
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw base image (cropped to a square)
    const size = Math.min(baseImage.width, baseImage.height);
    const sx = (baseImage.width - size) / 2;
    const sy = (baseImage.height - size) / 2;
    ctx.drawImage(baseImage, sx, sy, size, size, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Create a semi-transparent overlay at the bottom
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, CANVAS_HEIGHT - 60, CANVAS_WIDTH, 60);

    // Draw Logo
    try {
        const logoSvgString = new XMLSerializer().serializeToString(logoRef.current!);
        const logoImage = new Image();
        const svgBlob = new Blob([logoSvgString], {type: "image/svg+xml;charset=utf-8"});
        const url = URL.createObjectURL(svgBlob);
        
        logoImage.onload = () => {
            ctx.drawImage(logoImage, 10, CANVAS_HEIGHT - 50, 100, 40);
            URL.revokeObjectURL(url);
            
            // Draw QR Code if selected
            if (includeQrCode) {
                const qrCodeImage = new Image();
                qrCodeImage.onload = () => {
                    const qrSize = 100;
                    ctx.fillStyle = 'white';
                    ctx.fillRect(CANVAS_WIDTH - qrSize - 15, CANVAS_HEIGHT - qrSize - 25, qrSize + 10, qrSize + 10);
                    ctx.drawImage(qrCodeImage, CANVAS_WIDTH - qrSize - 10, CANVAS_HEIGHT - qrSize - 20, qrSize, qrSize);
                };
                qrCodeImage.src = 'https://placehold.co/100x100.png'; // Placeholder for the actual QR code
            }

            // Draw verified text
            ctx.font = 'bold 16px Inter';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'left';
            ctx.fillText('EventSafe Verified', 120, CANVAS_HEIGHT - 28);
        };
        logoImage.src = url;

    } catch (e) {
        console.error("Error rendering SVG:", e);
        toast({variant: 'destructive', title: 'Could not render logo'});
    }
  };
  
  const downloadImage = () => {
    if (canvasRef.current) {
        // First, generate the badge to make sure the canvas is up-to-date
        generateBadge();
        // Use a timeout to ensure canvas has been drawn before downloading
        setTimeout(() => {
            const dataUrl = canvasRef.current!.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'eventsafe_badge.png';
            link.click();
        }, 500); // 500ms delay to allow images to load and draw
    }
  }

  return (
    <>
        {/* Hidden SVG logo for rendering to canvas, moved outside the card to prevent hydration issues */}
        <div className="hidden">
            <Logo ref={logoRef} className="text-white" />
        </div>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Logo className="h-8 w-auto" /> Profile Badge Generator
                </CardTitle>
                <CardDescription>
                Create a badge for social media. This only identifies your status, not your full profile details.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor='badge-image'>1. Upload your picture</Label>
                    <Input id="badge-image" type="file" accept="image/*" onChange={handleFileChange} disabled={isLoading}/>
                </div>
                
                <div className="flex items-center space-x-2">
                    <Checkbox id="include-qr" checked={includeQrCode} onCheckedChange={(checked) => setIncludeQrCode(checked as boolean)} />
                    <Label htmlFor="include-qr" className="text-sm font-medium leading-none">Include QR Code</Label>
                </div>

                <div>
                    <Button onClick={generateBadge} disabled={!baseImage || isLoading}>
                        {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Check className="mr-2" />}
                        Generate Preview
                    </Button>
                </div>

                <div className="space-y-2">
                    <Label>2. Preview & Download</Label>
                    <div className="w-full aspect-square bg-muted rounded-md overflow-hidden relative border">
                        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="w-full h-full object-cover" />
                        {!baseImage && <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">Upload an image to see a preview</div>}
                    </div>
                </div>

                <Button onClick={downloadImage} disabled={!baseImage} className="w-full">
                    <Download className="mr-2" /> Download Badge
                </Button>
            </CardContent>
        </Card>
    </>
  );
}
