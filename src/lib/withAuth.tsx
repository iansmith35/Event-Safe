'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

export default function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const [authState, setAuthState] = useState<AuthState>({
      user: null,
      loading: true,
      isAdmin: false,
    });
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          // Not authenticated, redirect to login
          router.replace('/login');
          return;
        }

        // Check if user is admin
        try {
          const idTokenResult = await user.getIdTokenResult();
          const isAdmin = idTokenResult.claims.admin === true || 
                         user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
          
          if (!isAdmin) {
            // Authenticated but not admin, redirect to admin login
            router.replace('/admin/login');
            return;
          }

          setAuthState({
            user,
            loading: false,
            isAdmin: true,
          });
        } catch (error) {
          console.error('Error checking admin status:', error);
          router.replace('/admin/login');
        }
      });

      return () => unsubscribe();
    }, [router]);

    // Loading state
    if (authState.loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="container max-w-md mx-auto p-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Shield className="w-12 h-12 mx-auto text-muted-foreground animate-pulse" />
                  <div>
                    <h3 className="font-semibold text-lg">Verifying Access</h3>
                    <p className="text-sm text-muted-foreground">Checking authentication...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // Not authenticated (should have redirected, but show fallback)
    if (!authState.user) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="container max-w-md mx-auto p-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                  Access Required
                </CardTitle>
                <CardDescription>
                  You need to be signed in to access this area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Authentication Required</AlertTitle>
                  <AlertDescription>
                    Please sign in to continue to the admin area.
                  </AlertDescription>
                </Alert>
                <div className="mt-4">
                  <Button asChild className="w-full">
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // Not admin (should have redirected, but show fallback)
    if (!authState.isAdmin) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="container max-w-md mx-auto p-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-destructive" />
                  Admin Access Required
                </CardTitle>
                <CardDescription>
                  This area is restricted to administrators only
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Insufficient Privileges</AlertTitle>
                  <AlertDescription>
                    Your account does not have admin privileges to access this area.
                  </AlertDescription>
                </Alert>
                <div className="mt-4">
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/admin/login">Admin Login</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // Authenticated and admin - render the wrapped component
    return <WrappedComponent {...props} />;
  };
}