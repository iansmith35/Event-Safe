'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  DollarSign, 
  Users, 
  Shield, 
  AlertTriangle,
  ExternalLink,
  Calculator,
  RotateCcw
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Features, Pricing, Limits, AdminFlags, DEFAULT_FEATURES, DEFAULT_PRICING, DEFAULT_LIMITS, DEFAULT_ADMIN_FLAGS } from '@/types/config';

interface ConfigState {
  features: Features;
  pricing: Pricing;
  limits: Limits;
  admin: AdminFlags;
}

interface EntitySearchResult {
  id: string;
  email?: string;
  name?: string;
  type: 'user' | 'venue';
  suspended: boolean;
  notes?: string;
}

export default function AdminControlsPage() {
  const [config, setConfig] = useState<ConfigState>({
    features: DEFAULT_FEATURES,
    pricing: DEFAULT_PRICING,
    limits: DEFAULT_LIMITS,
    admin: DEFAULT_ADMIN_FLAGS
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [entitySearch, setEntitySearch] = useState('');
  const [searchResults, setSearchResults] = useState<EntitySearchResult[]>([]);
  const [recomputingScores, setRecomputingScores] = useState(false);

  // Load configuration from API
  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      // In a real implementation, we'd have an API to fetch config
      // For now, we'll use defaults and simulate loading
      setLoading(false);
    } catch (error) {
      console.error('Failed to load configuration:', error);
      toast({
        title: 'Error',
        description: 'Failed to load configuration',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  const updateConfig = async (section: keyof ConfigState, data: any) => {
    setSaving(section);
    try {
      const response = await fetch('/api/admin/config/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data })
      });

      if (!response.ok) {
        throw new Error('Failed to update configuration');
      }

      setConfig(prev => ({
        ...prev,
        [section]: data
      }));

      toast({
        title: 'Success',
        description: `${section.charAt(0).toUpperCase() + section.slice(1)} configuration updated`
      });
    } catch (error) {
      console.error('Failed to update config:', error);
      toast({
        title: 'Error',
        description: 'Failed to update configuration',
        variant: 'destructive'
      });
    } finally {
      setSaving(null);
    }
  };

  const searchEntities = async () => {
    if (!entitySearch.trim()) return;
    
    try {
      // This would be implemented as a proper API endpoint
      setSearchResults([]);
    } catch (error) {
      console.error('Failed to search entities:', error);
    }
  };

  const toggleEntitySuspension = async (entityId: string, type: 'user' | 'venue', suspend: boolean) => {
    try {
      const response = await fetch('/api/admin/entity/suspend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityId, type, suspend })
      });

      if (!response.ok) {
        throw new Error('Failed to update entity status');
      }

      toast({
        title: 'Success',
        description: `Entity ${suspend ? 'suspended' : 'unsuspended'}`
      });

      // Refresh search results
      searchEntities();
    } catch (error) {
      console.error('Failed to toggle suspension:', error);
      toast({
        title: 'Error',
        description: 'Failed to update entity status',
        variant: 'destructive'
      });
    }
  };

  const recomputeAllScores = async () => {
    setRecomputingScores(true);
    try {
      const response = await fetch('/api/admin/score/recompute', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to recompute scores');
      }

      toast({
        title: 'Success',
        description: 'Venue scores recomputation started'
      });
    } catch (error) {
      console.error('Failed to recompute scores:', error);
      toast({
        title: 'Error',
        description: 'Failed to start score recomputation',
        variant: 'destructive'
      });
    } finally {
      setRecomputingScores(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-8 h-8" />
        <div>
          <h1 className="text-3xl font-bold">Admin Controls</h1>
          <p className="text-gray-600">Manage features, pricing, and system configuration</p>
        </div>
      </div>

      {/* Emergency Controls */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            Emergency Controls
          </CardTitle>
          <CardDescription>
            Critical system-wide controls for emergencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="global-readonly" className="text-base font-medium">
                Global Read-Only Mode
              </Label>
              <p className="text-sm text-gray-600">
                Disables all write operations system-wide
              </p>
            </div>
            <Switch
              id="global-readonly"
              checked={config.admin.globalReadOnly}
              onCheckedChange={(checked) => 
                updateConfig('admin', { ...config.admin, globalReadOnly: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Feature Toggles
          </CardTitle>
          <CardDescription>
            Enable or disable platform features globally
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(config.features).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <Label htmlFor={key} className="text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                </div>
                <Switch
                  id={key}
                  checked={enabled}
                  onCheckedChange={(checked) => 
                    updateConfig('features', { ...config.features, [key]: checked })
                  }
                />
              </div>
            ))}
          </div>
          <div className="pt-4 border-t">
            <Button 
              onClick={() => updateConfig('features', config.features)}
              disabled={saving === 'features'}
              className="w-full"
            >
              {saving === 'features' ? 'Saving...' : 'Save Feature Settings'}
            </Button>
          </div>
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
            Adjust platform fees and membership pricing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="platform-fee">Platform Fee (%)</Label>
              <Input
                id="platform-fee"
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={config.pricing.platformFeePct}
                onChange={(e) => 
                  setConfig(prev => ({
                    ...prev,
                    pricing: { ...prev.pricing, platformFeePct: parseFloat(e.target.value) || 0 }
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="processing-fee">Processing Fee (£)</Label>
              <Input
                id="processing-fee"
                type="number"
                min="0"
                step="0.01"
                value={config.pricing.processingFeeGBP}
                onChange={(e) => 
                  setConfig(prev => ({
                    ...prev,
                    pricing: { ...prev.pricing, processingFeeGBP: parseFloat(e.target.value) || 0 }
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="guest-membership">Guest Membership (£/year)</Label>
              <Input
                id="guest-membership"
                type="number"
                min="0"
                step="0.01"
                value={config.pricing.guestMembershipGBPPerYear}
                onChange={(e) => 
                  setConfig(prev => ({
                    ...prev,
                    pricing: { ...prev.pricing, guestMembershipGBPPerYear: parseFloat(e.target.value) || 0 }
                  }))
                }
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
                onChange={(e) => 
                  setConfig(prev => ({
                    ...prev,
                    pricing: { ...prev.pricing, venueSubscriptionGBPPerMonth: parseFloat(e.target.value) || 0 }
                  }))
                }
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
                onChange={(e) => 
                  setConfig(prev => ({
                    ...prev,
                    pricing: { ...prev.pricing, courtCaseGBP: parseFloat(e.target.value) || 0 }
                  }))
                }
              />
            </div>
          </div>
          <Button 
            onClick={() => updateConfig('pricing', config.pricing)}
            disabled={saving === 'pricing'}
            className="w-full"
          >
            {saving === 'pricing' ? 'Saving...' : 'Save Pricing Settings'}
          </Button>
        </CardContent>
      </Card>

      {/* Usage Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Usage Limits
          </CardTitle>
          <CardDescription>
            Configure usage limits for different features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ai-daily-messages">AI Daily Messages per Guest</Label>
            <Input
              id="ai-daily-messages"
              type="number"
              min="0"
              value={config.limits.aiGuestDailyMessages}
              onChange={(e) => 
                setConfig(prev => ({
                  ...prev,
                  limits: { ...prev.limits, aiGuestDailyMessages: parseInt(e.target.value) || 0 }
                }))
              }
            />
          </div>
          <Button 
            onClick={() => updateConfig('limits', config.limits)}
            disabled={saving === 'limits'}
            className="w-full"
          >
            {saving === 'limits' ? 'Saving...' : 'Save Limit Settings'}
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
            Search and manage user/venue suspensions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search by email or venue name..."
              value={entitySearch}
              onChange={(e) => setEntitySearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchEntities()}
            />
            <Button onClick={searchEntities}>Search</Button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="space-y-2">
              {searchResults.map((entity) => (
                <div key={entity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{entity.email || entity.name}</div>
                    <div className="text-sm text-gray-600">
                      {entity.type} • {entity.suspended ? 'Suspended' : 'Active'}
                    </div>
                    {entity.notes && (
                      <div className="text-sm text-gray-500 mt-1">{entity.notes}</div>
                    )}
                  </div>
                  <Button
                    variant={entity.suspended ? 'default' : 'destructive'}
                    size="sm"
                    onClick={() => toggleEntitySuspension(entity.id, entity.type, !entity.suspended)}
                  >
                    {entity.suspended ? 'Unsuspend' : 'Suspend'}
                  </Button>
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
            <Calculator className="w-5 h-5" />
            Venue Scores
          </CardTitle>
          <CardDescription>
            Manage venue scoring system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Recompute All Venue Scores</p>
              <p className="text-sm text-gray-600">
                Recalculates scores for all venues based on current data
              </p>
            </div>
            <Button
              onClick={recomputeAllScores}
              disabled={recomputingScores}
              className="flex items-center gap-2"
            >
              <RotateCcw className={`w-4 h-4 ${recomputingScores ? 'animate-spin' : ''}`} />
              {recomputingScores ? 'Computing...' : 'Recompute All'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stripe Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Stripe Integration
          </CardTitle>
          <CardDescription>
            Payment system configuration status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Guest Yearly Price ID</span>
            <Badge variant={process.env.NEXT_PUBLIC_STRIPE_PRICE_GUEST_YEARLY ? 'default' : 'destructive'}>
              {process.env.NEXT_PUBLIC_STRIPE_PRICE_GUEST_YEARLY ? 'Configured' : 'Missing'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Venue Monthly Price ID</span>
            <Badge variant={process.env.NEXT_PUBLIC_STRIPE_PRICE_VENUE_MONTHLY ? 'default' : 'destructive'}>
              {process.env.NEXT_PUBLIC_STRIPE_PRICE_VENUE_MONTHLY ? 'Configured' : 'Missing'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Court Case Price ID</span>
            <Badge variant={process.env.NEXT_PUBLIC_STRIPE_PRICE_COURT_CASE ? 'default' : 'secondary'}>
              {process.env.NEXT_PUBLIC_STRIPE_PRICE_COURT_CASE ? 'Configured' : 'Optional'}
            </Badge>
          </div>
          <Separator />
          <Button asChild className="w-full">
            <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer">
              Open Stripe Dashboard
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}