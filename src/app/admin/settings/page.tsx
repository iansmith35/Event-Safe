'use client';

import withAuth from '@/lib/withAuth';
import AdminNav from '@/components/AdminNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Flags } from '@/lib/flags';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

function AdminSettingsPage() {
  const [flags, setFlags] = useState<Flags>({
    homepageMap: false,
    aiRebecca: false,
    demoMode: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [homepageHeroMediaId, setHomepageHeroMediaId] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    loadFlags();
  }, []);

  const loadFlags = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'admin', 'settings');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFlags({
          homepageMap: data.homepageMap ?? false,
          aiRebecca: data.aiRebecca ?? false,
          demoMode: data.demoMode ?? true,
        });
        setHomepageHeroMediaId(data.homepageHeroMediaId || '');
      }
    } catch (error) {
      console.error('Failed to load flags:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveFlags = async () => {
    try {
      setSaving(true);
      const docRef = doc(db, 'admin', 'settings');
      await setDoc(docRef, {
        ...flags,
        homepageHeroMediaId: homepageHeroMediaId || null,
        updatedAt: serverTimestamp(),
        updatedBy: 'admin'
      }, { merge: true });

      toast({
        title: "Settings saved",
        description: "Feature flags have been updated successfully",
      });
    } catch (error) {
      console.error('Failed to save flags:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-pulse text-muted-foreground mb-2">Loading settings...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <AdminNav />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Admin Settings</h1>
              <p className="text-muted-foreground">Manage feature flags and global configuration</p>
            </div>
          </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Feature Flags
          </CardTitle>
          <CardDescription>
            Control platform features with kill switches. Changes take effect immediately.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="homepage-map" className="text-base font-medium">
                  Homepage Map
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enable interactive Google Maps on the homepage. Disable for faster loading.
                </p>
              </div>
              <Switch
                id="homepage-map"
                checked={flags.homepageMap}
                onCheckedChange={(checked) => setFlags(prev => ({
                  ...prev,
                  homepageMap: checked
                }))}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="ai-rebecca" className="text-base font-medium">
                  AI Rebecca
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enable Rebecca AI chatbot functionality. Disable to show "temporarily unavailable" message.
                </p>
              </div>
              <Switch
                id="ai-rebecca"
                checked={flags.aiRebecca}
                onCheckedChange={(checked) => setFlags(prev => ({
                  ...prev,
                  aiRebecca: checked
                }))}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="demo-mode" className="text-base font-medium">
                  Demo Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Show demo content and examples. Disable to hide demo features.
                </p>
              </div>
              <Switch
                id="demo-mode"
                checked={flags.demoMode}
                onCheckedChange={(checked) => setFlags(prev => ({
                  ...prev,
                  demoMode: checked
                }))}
              />
            </div>
          </div>

          <div className="pt-6 border-t">
            <Button onClick={saveFlags} disabled={saving} className="w-full sm:w-auto">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
}

export default withAuth(AdminSettingsPage);