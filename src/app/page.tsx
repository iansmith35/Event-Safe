"use client";

import { useState } from 'react';
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
  ShieldCheck,
  User,
  Menu,
  LogIn,
  UserPlus,
  Bell,
  ChevronDown,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GuestView from '@/components/guest-view';
import AdminDashboard from '@/components/admin-dashboard';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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
          <div className="p-2 rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-semibold group-data-[collapsible=icon]:hidden">Event Traffic</h1>
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
              tooltip={{children: "Admin Tools"}}
            >
              <LayoutDashboard />
              <span>Admin Tools</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}

export default function Home() {
  const [activeView, setActiveView] = useState('guest');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

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
            <div></div>
             <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/signup">
                  <UserPlus />
                  Sign Up
                </Link>
              </Button>
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
                    <LogIn />
                    Login
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href="#" className="flex items-center w-full">Guest Login</Link>
                  </DropdownMenuItem>
                   <DropdownMenuItem>
                    <Link href="#" className="flex items-center w-full">Staff Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="#" className="flex items-center w-full">Admin Login</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Avatar>
                <AvatarImage src="https://placehold.co/100x100.png" alt="@guest" data-ai-hint="profile picture" />
                <AvatarFallback>G</AvatarFallback>
              </Avatar>
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
