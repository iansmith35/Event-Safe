
"use client";

import { useState, useEffect } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  User,
  Menu,
  UserPlus,
  Loader2,
} from 'lucide-react';
import GuestView from '@/components/guest-view';
import AdminDashboard from '@/components/admin-dashboard';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const ADMIN_EMAIL = 'ian@ishe-ltd.co.uk';

function AppSidebar({ activeView, setActiveView, onLinkClick }: { activeView: string, setActiveView: (view: string) => void, onLinkClick?: () => void }) {
  const handleMenuClick = (view: string) => {
    setActiveView(view);
    if (onLinkClick) {
      onLinkClick();
    }
  }

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="w-auto h-8 text-primary" />
          <h1 className="text-xl font-semibold group-data-[collapsible=icon]:hidden">EventSafe</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => handleMenuClick('guest')}
              isActive={activeView === 'guest'}
              tooltip={{children: "Guest Dashboard"}}
            >
              <User />
              <span>Guest Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => handleMenuClick('admin')}
              isActive={activeView === 'admin'}
              tooltip={{children: "Host & Admin Tools"}}
            >
              <LayoutDashboard />
              <span>Host & Admin Tools</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}

export default function DashboardPage() {
  const [activeView, setActiveView] = useState('guest');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const isMobile = useIsMobile();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        if (user.email === ADMIN_EMAIL) {
          setActiveView('admin');
        } else {
          setActiveView('guest');
        }
      } else {
        // If no user, redirect to login
        router.push('/login');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        {isMobile ? (
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="fixed top-4 left-4 z-20 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-sidebar text-sidebar-foreground border-r-0">
                <AppSidebar activeView={activeView} setActiveView={setActiveView} onLinkClick={() => setMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>
        ) : (
          <Sidebar collapsible="icon" className="border-r">
            <AppSidebar activeView={activeView} setActiveView={setActiveView} />
          </Sidebar>
        )}
        <div className="flex-1 flex flex-col">
           <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b h-[65px]">
            <Button asChild variant="outline">
              <Link href="/">Back to Home</Link>
            </Button>
             <div className="flex items-center gap-4">
              <Button asChild variant="secondary">
                  <Link href="/signup">
                    <UserPlus />
                    Guest Signup
                  </Link>
              </Button>
               <Button asChild>
                  <Link href="/host-signup">
                    <UserPlus />
                   Host Signup
                  </Link>
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8">
            {activeView === 'guest' && <GuestView />}
            {activeView === 'admin' && <AdminDashboard />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
