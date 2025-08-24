'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { Shield, AlertCircle, User } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [passcode, setPasscode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!user) {
      setError('Please sign in first');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          passcode,
          userEmail: user.email,
          userId: user.uid,
        }),
      });

      const result = await response.json();
      
      if (result.ok) {
        router.push(result.redirect || '/admin');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Admin login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthorizedEmail = user?.email?.toLowerCase() === 'ian@ishe-ltd.co.uk';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <Logo className="w-auto h-12 text-primary mb-4" />
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8" />
            Admin Access
          </h1>
          <p className="text-muted-foreground mt-2 text-center">
            Enter your admin passcode to continue
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Admin Authentication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current User Status */}
            <div className="p-3 bg-muted rounded-md">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4" />
                <span className="font-medium">Current User:</span>
              </div>
              {user ? (
                <div className="mt-1 text-sm">
                  <div className="text-muted-foreground">{user.email}</div>
                  {!isAuthorizedEmail && (
                    <div className="text-red-600 text-xs mt-1">
                      ⚠️ This account is not authorized for admin access
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-1 text-sm text-muted-foreground">
                  Not signed in. 
                  <a href="/login" className="text-primary hover:underline ml-1">
                    Please sign in first
                  </a>
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Unauthorized Email Warning */}
            {user && !isAuthorizedEmail && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Unauthorized Account</AlertTitle>
                <AlertDescription>
                  This account is not authorized for admin access. Only the designated admin email can access this area.
                </AlertDescription>
              </Alert>
            )}

            {/* Passcode Form */}
            {user && isAuthorizedEmail && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="passcode">Admin Passcode</Label>
                  <Input
                    id="passcode"
                    type="password"
                    placeholder="Enter admin passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading || !passcode.trim()}
                >
                  {isLoading ? 'Verifying...' : 'Access Admin Panel'}
                </Button>
              </form>
            )}

            {/* Sign In Prompt */}
            {!user && (
              <div className="text-center">
                <Button asChild variant="outline" className="w-full">
                  <a href="/login">Sign In to Continue</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}