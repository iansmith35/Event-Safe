'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Settings, DollarSign, Users, Shield, Zap, Search, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Features, Pricing, Limits, AdminFlags, EntityStatus, DEFAULT_FEATURES, DEFAULT_PRICING, DEFAULT_LIMITS, DEFAULT_ADMIN_FLAGS } from '@/types/config';

interface ConfigState {
  features: Features;
  pricing: Pricing;
  limits: Limits;
  admin: AdminFlags;
}

interface EntitySearchResult {
  id: string;
  type: 'user' | 'venue';
  email?: string;
  name?: string;
  status?: EntityStatus;
}

export default function AdminControlsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recomputingScores, setRecomputingScores] = useState(false);
  const [config, setConfig] = useState<ConfigState>({
    features: DEFAULT_FEATURES,
    pricing: DEFAULT_PRICING,
    limits: DEFAULT_LIMITS,
    admin: DEFAULT_ADMIN_FLAGS
  });

  // Entity search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<EntitySearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Load initial config
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      
      // In a real app, we'd load from Firestore
      // For now, use defaults with some demo data
      setConfig({
        features: { ...DEFAULT_FEATURES },
        pricing: { ...DEFAULT_PRICING },
        limits: { ...DEFAULT_LIMITS },
        admin: { ...DEFAULT_ADMIN_FLAGS }
      });
      
    } catch (error) {
      console.error('Failed to load config:', error);
      toast({
        title: 'Error',
        description: 'Failed to load configuration',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (section: keyof ConfigState) => {
    try {
      setSaving(true);
      
      // Call the appropriate API endpoint
      const response = await fetch('/api/admin/config/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          data: config[section]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }

      toast({
        title: 'Success',
        description: `${section} configuration saved successfully`,
      });

    } catch (error) {
      console.error('Failed to save config:', error);
      toast({
        title: 'Error',
        description: 'Failed to save configuration',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const searchEntities = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      
      // Call search API
      const response = await fetch(`/api/admin/entity/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.ok) {
        setSearchResults(data.results || []);
      } else {
        throw new Error(data.error || 'Search failed');
      }

    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to search entities',
        variant: 'destructive'
      });
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const toggleEntitySuspension = async (entityId: string, entityType: 'user' | 'venue', currentlySuspended: boolean) => {
    try {
      const response = await fetch('/api/admin/entity/suspend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityId,
          entityType,
          suspended: !currentlySuspended
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update entity status');
      }

      toast({
        title: 'Success',
        description: `Entity ${!currentlySuspended ? 'suspended' : 'unsuspended'} successfully`,
      });

      // Refresh search results
      searchEntities();

    } catch (error) {
      console.error('Failed to update entity status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update entity status',
        variant: 'destructive'
      });
    }
  };

  const recomputeVenueScores = async () => {
    try {
      setRecomputingScores(true);
      
      const response = await fetch('/api/admin/score/recompute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to recompute scores');
      }

      const data = await response.json();

      toast({
        title: 'Success',
        description: `Recomputed scores for ${data.venuesProcessed || 0} venues`,
      });

    } catch (error) {
      console.error('Failed to recompute scores:', error);
      toast({
        title: 'Error',
        description: 'Failed to recompute venue scores',
        variant: 'destructive'
      });
    } finally {
      setRecomputingScores(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6 pt-16 md:pt-20">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Admin Controls</h1>
            <p className="text-muted-foreground">Loading configuration...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 pt-16 md:pt-20">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Admin Controls</h1>
          <p className="text-muted-foreground">Manage features, pricing, and system configuration</p>
        </div>
      </div>

      {/* Emergency Controls */}
      <Card className="border-red-200 bg-red-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            Emergency Controls
          </CardTitle>
          <CardDescription>
            Global emergency switches that affect all users immediately
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="global-readonly" className="text-base font-medium">
                Global Read-Only Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Disables all user actions (purchases, bookings, etc.) across the platform
              </p>
            </div>
            <Switch
              id="global-readonly"
              checked={config.admin.globalReadOnly}
              onCheckedChange={(checked) => setConfig(prev => ({
                ...prev,
                admin: { ...prev.admin, globalReadOnly: checked }
              }))}
            />
          </div>
          <Button 
            onClick={() => saveConfig('admin')}
            variant={config.admin.globalReadOnly ? 'destructive' : 'outline'}
            disabled={saving}
            className="w-full"
          >
            {saving ? 'Saving...' : 'Save Emergency Settings'}
          </Button>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Feature Toggles
          </CardTitle>
          <CardDescription>
            Enable or disable platform features globally
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(config.features).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <Label htmlFor={`feature-${key}`} className="text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                </div>
                <Switch
                  id={`feature-${key}`}
                  checked={value}
                  onCheckedChange={(checked) => setConfig(prev => ({
                    ...prev,
                    features: { ...prev.features, [key]: checked }
                  }))}
                />
              </div>
            ))}
          </div>
          <Button 
            onClick={() => saveConfig('features')}
            disabled={saving}
            className="w-full"
          >
            {saving ? 'Saving...' : 'Save Feature Settings'}
          </Button>
        </CardContent>
      </Card>

      {/* Pricing Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Pricing Configuration
          </CardTitle>
          <CardDescription>
            Adjust platform fees and subscription pricing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="platform-fee">Platform Fee (%)</Label>
              <Input
                id="platform-fee"
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={config.pricing.platformFeePct}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  pricing: { ...prev.pricing, platformFeePct: parseFloat(e.target.value) || 0 }
                }))}
              />
              <p className="text-xs text-muted-foreground mt-1">Absorbed by organiser</p>
            </div>
            <div>
              <Label htmlFor="processing-fee">Processing Fee (£)</Label>
              <Input
                id="processing-fee"
                type="number"
                min="0"
                step="0.01"
                value={config.pricing.processingFeeGBP}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  pricing: { ...prev.pricing, processingFeeGBP: parseFloat(e.target.value) || 0 }
                }))}
              />
              <p className="text-xs text-muted-foreground mt-1">Per order, paid by guest</p>
            </div>
            <div>
              <Label htmlFor="guest-membership">Guest Membership (£/year)</Label>
              <Input
                id="guest-membership"
                type="number"
                min="0"
                step="0.01"
                value={config.pricing.guestMembershipGBPPerYear}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  pricing: { ...prev.pricing, guestMembershipGBPPerYear: parseFloat(e.target.value) || 0 }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="venue-subscription">Venue Subscription (£/month)</Label>
              <Input
                id="venue-subscription"
                type="number"
                min="0"
                step="0.01"
                value={config.pricing.venueSubscriptionGBPPerMonth}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  pricing: { ...prev.pricing, venueSubscriptionGBPPerMonth: parseFloat(e.target.value) || 0 }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="court-case">Court Case Fee (£)</Label>
              <Input
                id="court-case"
                type="number"
                min="0"
                step="0.01"
                value={config.pricing.courtCaseGBP}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  pricing: { ...prev.pricing, courtCaseGBP: parseFloat(e.target.value) || 0 }
                }))}
              />
              <p className="text-xs text-muted-foreground mt-1">Per case filing</p>
            </div>
          </div>
          <Button 
            onClick={() => saveConfig('pricing')}
            disabled={saving}
            className="w-full"
          >
            {saving ? 'Saving...' : 'Save Pricing Settings'}
          </Button>
        </CardContent>
      </Card>

      {/* Usage Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Limits</CardTitle>
          <CardDescription>
            Configure usage limits for platform features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ai-messages">AI Messages per Guest per Day</Label>
              <Input
                id="ai-messages"
                type="number"
                min="1"
                max="100"
                value={config.limits.aiGuestDailyMessages}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  limits: { ...prev.limits, aiGuestDailyMessages: parseInt(e.target.value) || 1 }
                }))}
              />
            </div>
          </div>
          <Button 
            onClick={() => saveConfig('limits')}
            disabled={saving}
            className="w-full"
          >
            {saving ? 'Saving...' : 'Save Limit Settings'}
          </Button>
        </CardContent>
      </Card>

      {/* Entity Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Entity Management
          </CardTitle>
          <CardDescription>
            Search and manage user/venue accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search by email or venue name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchEntities()}
            />
            <Button onClick={searchEntities} disabled={searchLoading}>
              {searchLoading ? 'Searching...' : <Search className="w-4 h-4" />}
            </Button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searchResults.map((entity) => (
                <div key={`${entity.type}-${entity.id}`} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{entity.name || entity.email}</div>
                    <div className="text-sm text-muted-foreground">
                      <Badge variant="outline" className="mr-2">{entity.type}</Badge>
                      {entity.email}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {entity.status?.suspended && (
                      <Badge variant="destructive">Suspended</Badge>
                    )}
                    <Button
                      size="sm"
                      variant={entity.status?.suspended ? "default" : "destructive"}
                      onClick={() => toggleEntitySuspension(entity.id, entity.type, !!entity.status?.suspended)}
                    >
                      {entity.status?.suspended ? 'Unsuspend' : 'Suspend'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Venue Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Venue Scores
          </CardTitle>
          <CardDescription>
            Manage venue scoring system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h5 className="font-semibold mb-2">Scoring Formula</h5>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Base Score: 750</li>
              <li>• Completed Events: +10 each</li>
              <li>• Refunds: -20 each</li>
              <li>• Disputes: -50 each</li>
              <li>• Safety Incidents: -100 each</li>
            </ul>
          </div>
          
          <Button 
            onClick={recomputeVenueScores}
            disabled={recomputingScores}
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {recomputingScores ? 'Recomputing...' : 'Recompute All Venue Scores'}
          </Button>
        </CardContent>
      </Card>

      {/* Stripe Status */}
      <Card>
        <CardHeader>
          <CardTitle>Stripe Integration</CardTitle>
          <CardDescription>
            Payment processing status and configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Environment Variables</Label>
              <div className="space-y-2 mt-2">
                <div className="flex justify-between text-sm">
                  <span>STRIPE_SECRET_KEY:</span>
                  <Badge variant={process.env.STRIPE_SECRET_KEY ? 'default' : 'destructive'}>
                    {process.env.STRIPE_SECRET_KEY ? 'Set' : 'Missing'}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>STRIPE_WEBHOOK_SECRET:</span>
                  <Badge variant={process.env.STRIPE_WEBHOOK_SECRET ? 'default' : 'destructive'}>
                    {process.env.STRIPE_WEBHOOK_SECRET ? 'Set' : 'Missing'}
                  </Badge>
                </div>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Required Price IDs</Label>
              <div className="space-y-1 mt-2 text-xs text-muted-foreground">
                <div>STRIPE_PRICE_GUEST_YEARLY</div>
                <div>STRIPE_PRICE_VENUE_MONTHLY</div>
                <div>STRIPE_PRICE_COURT_CASE</div>
              </div>
            </div>
          </div>
          
          <Button variant="outline" className="w-full" asChild>
            <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer">
              Open Stripe Dashboard
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}