
"use client";

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Camera, ShieldCheck, ShoppingCart, CheckCircle, AlertCircle, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { verifyGuestInPhoto, VerifyGuestInPhotoOutput } from '@/ai/flows/verify-guest-in-photo';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

interface EventPhoto {
    id: string;
    url: string;
    hint: string;
    purchased: boolean;
}

const initialPhotos: EventPhoto[] = [
    { id: 'photo1', url: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=800', hint: 'crowd concert', purchased: false },
    { id: 'photo2', url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800', hint: 'people talking party', purchased: false },
    { id: 'photo3', url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800', hint: 'people at concert', purchased: false },
    { id: 'photo4', url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800', hint: 'festival crowd', purchased: false },
];

// In a real app, this would be the logged-in user's profile picture.
const guestProfilePhotoUri = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400';

interface EventGalleryProps {
    userType: 'guest' | 'host';
}

export default function EventGallery({ userType }: EventGalleryProps) {
    const [photos, setPhotos] = useState<EventPhoto[]>(initialPhotos);
    const [cart, setCart] = useState<string[]>([]);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [verificationResults, setVerificationResults] = useState<Record<string, VerifyGuestInPhotoOutput>>({});
    const [photoConsent, setPhotoConsent] = useState(true);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newPhotos: EventPhoto[] = Array.from(files).map(file => ({
                id: `new-${Math.random()}`,
                url: URL.createObjectURL(file),
                hint: 'uploaded event photo',
                purchased: false,
            }));
            setPhotos(prev => [...prev, ...newPhotos]);
            toast({ title: `${files.length} photo(s) uploaded successfully.` });
        }
    };
    
    const toggleCartItem = (photoId: string) => {
        setCart(prev =>
            prev.includes(photoId) ? prev.filter(id => id !== photoId) : [...prev, photoId]
        );
    };

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        setVerificationResults({});
        let allVerified = true;

        for (const photoId of cart) {
            const photo = photos.find(p => p.id === photoId);
            if (!photo) continue;

            try {
                const result = await verifyGuestInPhoto({
                    guestProfilePhotoUri: guestProfilePhotoUri,
                    eventPhotoUri: photo.url,
                });
                setVerificationResults(prev => ({ ...prev, [photoId]: result }));
                if (!result.isMatch) {
                    allVerified = false;
                }
            } catch (error) {
                console.error(error);
                toast({ variant: 'destructive', title: `Verification failed for photo ${photoId}` });
                allVerified = false;
                break;
            }
        }

        if (allVerified) {
             setPhotos(prevPhotos =>
                prevPhotos.map(p =>
                    cart.includes(p.id) ? { ...p, purchased: true } : p
                )
            );
            setCart([]);
            toast({
                title: "Purchase Successful!",
                description: "Your photos have been added to your profile without watermarks."
            });
        } else {
             toast({
                variant: 'destructive',
                title: "Purchase Failed",
                description: "Some photos could not be verified. You can only purchase photos you are in."
            });
        }
        setIsCheckingOut(false);
    };


    return (
        <div className={cn(userType === 'guest' && "prevent-screenshot")}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Camera /> Event Photo Gallery</CardTitle>
                    <CardDescription>
                        {userType === 'host'
                            ? "Upload and manage photos from your event. Photos will be watermarked until purchased."
                            : "Browse and purchase photos from the event. Photos you are in can be purchased to remove the watermark."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {userType === 'host' && (
                        <div className="p-4 border-dashed border-2 rounded-lg text-center">
                            <Button onClick={() => fileInputRef.current?.click()}>
                                <Upload className="mr-2" /> Upload Photos
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                multiple
                                accept="image/*"
                                onChange={handleFileUpload}
                            />
                            <p className="text-xs text-muted-foreground mt-2">Upload high-resolution images for sale.</p>
                        </div>
                    )}
                    
                     {userType === 'guest' && (
                        <div className="flex items-center space-x-2">
                            <Checkbox id="photo-consent" checked={photoConsent} onCheckedChange={(checked) => setPhotoConsent(!!checked)} />
                            <Label htmlFor="photo-consent" className="text-sm">I consent to my photos being taken and displayed here.</Label>
                        </div>
                     )}

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {photos.map(photo => (
                            <div key={photo.id} className="relative group">
                                <Image
                                    src={photo.url}
                                    alt="Event photo"
                                    width={400}
                                    height={400}
                                    className={cn(
                                        "object-cover rounded-lg aspect-square border",
                                        cart.includes(photo.id) && "ring-2 ring-primary ring-offset-2"
                                    )}
                                    data-ai-hint={photo.hint}
                                />
                                {(!photo.purchased && userType === 'guest') && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                        EventSafe
                                    </div>
                                )}
                                {photo.purchased && (
                                     <div className="absolute top-2 right-2 p-1 bg-green-500 rounded-full text-white">
                                        <CheckCircle className="h-5 w-5" />
                                     </div>
                                )}
                                 {userType === 'guest' && !photo.purchased && photoConsent && (
                                    <Button
                                        size="icon"
                                        className="absolute top-2 left-2"
                                        variant={cart.includes(photo.id) ? 'default' : 'secondary'}
                                        onClick={() => toggleCartItem(photo.id)}
                                    >
                                        <ShoppingCart className="h-4 w-4" />
                                    </Button>
                                )}
                                {userType === 'host' && (
                                     <Button
                                        size="icon"
                                        className="absolute top-2 right-2"
                                        variant='destructive'
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    {userType === 'guest' && cart.length > 0 && (
                        <div className="pt-6 border-t space-y-4">
                            <h3 className="text-lg font-semibold">Shopping Cart</h3>
                             <div className="space-y-2">
                                {cart.map(id => {
                                    const photo = photos.find(p => p.id === id);
                                    const verification = verificationResults[id];
                                    return (
                                        <div key={id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                                            <Image src={photo?.url || ''} alt="cart item" width={40} height={40} className="rounded-md" />
                                            <p className="flex-1 text-sm">Photo Ref: ...{id.slice(-4)}</p>
                                            {isCheckingOut && !verification && <Loader2 className="animate-spin h-4 w-4" />}
                                            {verification && (
                                                <div className={cn("flex items-center gap-1 text-xs", verification.isMatch ? 'text-green-600' : 'text-destructive')}>
                                                    {verification.isMatch ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                                    {verification.isMatch ? 'Verified' : 'Not You'}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                            <CardFooter className="flex-col items-start gap-4 p-0">
                                <Alert>
                                    <ShieldCheck className="h-4 w-4" />
                                    <AlertTitle>Pre-Purchase Verification</AlertTitle>
                                    <AlertDescription>
                                        Our AI will verify you are in each photo before finalizing the purchase to ensure privacy and fairness.
                                    </AlertDescription>
                                </Alert>
                                <Button onClick={handleCheckout} disabled={isCheckingOut}>
                                    {isCheckingOut ? <Loader2 className="animate-spin" /> : <ShoppingCart />}
                                    {isCheckingOut ? "Verifying & Purchasing..." : `Purchase ${cart.length} photo(s) for £${cart.length.toFixed(2)}`}
                                </Button>
                            </CardFooter>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
