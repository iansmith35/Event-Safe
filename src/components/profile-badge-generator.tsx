
"use client";

import { useRef, useState, useEffect } from 'react';
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
    const { toast } = useToast();
    
    const [logoSvg] = useState(() => {
        if (typeof window === 'undefined') return '';
        const div = document.createElement('div');
        div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 40" class="h-10 w-auto" fill="white"><g><path d="M20 0C8.95 0 0 8.95 0 20v14c0 3.31 2.69 6 6 6h28c3.31 0 6-2.69 6-6V20C40 8.95 31.05 0 20 0z" fill="#16A34A"></path><g fill="#27272A"><rect x="14" y="5" width="12" height="26" rx="4"></rect></g><circle cx="20" cy="11" r="3" fill="#EF4444"></circle><circle cx="20" cy="18" r="3" fill="#FBBF24"></circle><circle cx="20" cy="25" r="3" fill="#22C55E"></circle></g><text x="48" y="16" font-family="Inter, sans-serif" font-size="18" font-weight="bold" fill="currentColor">Event</text><text x="48" y="35" font-family="Inter, sans-serif" font-size="18" font-weight="bold" fill="currentColor">Safe</text></svg>`;
        return div.innerHTML;
    });

    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
            img.src = src;
        });
    };
    
    useEffect(() => {
        // Pre-load the default badge image for the demo
        const loadDefaultBadge = async () => {
            try {
                const defaultImage = await loadImage("https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400");
                setBaseImage(defaultImage);
            } catch (error) {
                console.error("Failed to load default badge image", error);
            }
        };
        loadDefaultBadge();
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsLoading(true);
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
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
        
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        const size = Math.min(baseImage.width, baseImage.height);
        const sx = (baseImage.width - size) / 2;
        const sy = (baseImage.height - size) / 2;
        ctx.drawImage(baseImage, sx, sy, size, size, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, CANVAS_HEIGHT - 60, CANVAS_WIDTH, 60);

        try {
            const logoImage = await loadImage('data:image/svg+xml;base64,' + btoa(logoSvg));
            ctx.drawImage(logoImage, 10, CANVAS_HEIGHT - 50, 100, 40);

            if (includeQrCode) {
                const qrCodeImage = await loadImage('https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Example');
                const qrSize = 100;
                ctx.fillStyle = 'white';
                ctx.fillRect(CANVAS_WIDTH - qrSize - 15, CANVAS_HEIGHT - qrSize - 25, qrSize + 10, qrSize + 10);
                ctx.drawImage(qrCodeImage, CANVAS_WIDTH - qrSize - 10, CANVAS_HEIGHT - qrSize - 20, qrSize, qrSize);
            }

            ctx.font = 'bold 16px Inter';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'left';
            ctx.fillText('EventSafe Verified', 120, CANVAS_HEIGHT - 28);
        } catch (error) {
            console.error("Error drawing overlays:", error);
            toast({ variant: 'destructive', title: 'Could not generate badge preview' });
        }
    };
  
    useEffect(() => {
        if(baseImage) {
            generateBadge();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseImage, includeQrCode]);

    const downloadImage = () => {
        generateBadge().then(() => {
            setTimeout(() => {
                 if (canvasRef.current) {
                    const dataUrl = canvasRef.current.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = 'eventsafe_badge.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }, 200)
        })
    }

    return (
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
    );
}
