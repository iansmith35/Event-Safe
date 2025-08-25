'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Settings, 
  Image, 
  Shield, 
  Users, 
  FileText,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface AdminNavProps {
  className?: string;
}

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: Home
  },
  {
    title: 'Controls',  
    href: '/admin/controls',
    icon: Shield
  },
  {
    title: 'Media Library',
    href: '/admin/media', 
    icon: Image
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings
  },
  {
    title: 'Overview',
    href: '/admin/overview',
    icon: FileText
  }
];

export default function AdminNav({ className }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <nav className="space-y-2">
          <div className="pb-2 mb-2 border-b">
            <h3 className="font-semibold text-sm text-muted-foreground">Admin Panel</h3>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Button
                key={item.href}
                asChild
                variant={isActive ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start text-left',
                  isActive && 'bg-primary text-primary-foreground'
                )}
                size="sm"
              >
                <Link href={item.href}>
                  <Icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            );
          })}
          
          <div className="pt-2 mt-4 border-t">
            <Button
              asChild
              variant="outline"
              className="w-full justify-start text-left"
              size="sm"
            >
              <Link href="/admin/logout">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Link>
            </Button>
          </div>
        </nav>
      </CardContent>
    </Card>
  );
}