
"use client";

import { useState, useEffect, Suspense } from 'react';
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
  Home,
} from 'lucide-react';
import GuestView from '@/components/guest-view';
import AdminDashboard from '@/components/admin-dashboard';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { useSearchParams } from 'next/navigation';

const ADMIN_EMAIL = 'ian@ishe-ltd.co.uk';
const DEMO_EMAIL = 'demo@eventsafe.com';

function AppSidebar({ activeView, setActiveView, onLinkClick, isAdmin }: { activeView: string, setActiveView: (view: string) => void, onLinkClick?: () => void, isAdmin: boolean }) {
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
          {isAdmin && (
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
          )}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}

// Resolved: components using useSearchParams() are wrapped in <Suspense>. (Next.js requirement)

function DashboardContent() {
  const [activeView, setActiveView] = useState('guest');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email: string | null }>({ email: DEMO_EMAIL });
  const [isAdmin, setIsAdmin] = useState(false);
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();

  useEffect(() => {
    // For demo/testing purposes, we'll use a URL parameter to switch between admin/guest views
    const view = searchParams.get('view');
    const isAdminUser = view === 'admin';
    
    setIsAdmin(isAdminUser);
    setUser({ email: isAdminUser ? ADMIN_EMAIL : DEMO_EMAIL });

    if (isAdminUser) {
      setActiveView('admin');
    } else {
      setActiveView('guest');
    }
  }, [searchParams]);

  
  const currentView = isAdmin && activeView === 'admin' ? <AdminDashboard /> : <GuestView />;


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
                <AppSidebar activeView={activeView} setActiveView={setActiveView} onLinkClick={() => setMobileMenuOpen(false)} isAdmin={isAdmin} />
            </SheetContent>
          </Sheet>
        ) : (
          <Sidebar collapsible="icon" className="border-r">
            <AppSidebar activeView={activeView} setActiveView={setActiveView} isAdmin={isAdmin} />
          </Sidebar>
        )}
        <div className="flex-1 flex flex-col">
           <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b h-[65px]">
            <Button asChild variant="outline">
              <Link href="/uk">
                <Home /> Back to Home
              </Link>
            </Button>
            <div className="flex items-center gap-4">
               <p className="text-sm text-muted-foreground">Viewing as: <span className="font-semibold">{user?.email}</span></p>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8">
            {currentView}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
