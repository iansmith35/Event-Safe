'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CreditCard, Crown, Calendar, ExternalLink, CheckCircle } from 'lucide-react';
import { UserMembership } from '@/types/config';

interface MembershipCardProps {
  membership?: UserMembership;
  userId: string;
  userEmail?: string;
  onUpgrade?: () => void;
}

export function MembershipCard({ 
  membership, 
  userId, 
  userEmail,
  onUpgrade 
}: MembershipCardProps) {
  const [upgrading, setUpgrading] = useState(false);

  const isActive = membership?.active && (
    !membership.currentPeriodEnd || 
    new Date() <= membership.currentPeriodEnd
  );

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const response = await fetch('/api/billing/guest/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          guestId: userId, 
          email: userEmail,
          returnUrl: window.location.href
        })
      });

      const data = await response.json();
      if (data.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        console.error('Failed to create checkout session:', data.error);
        alert('Failed to start checkout process. Please try again.');
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      alert('Failed to start upgrade process. Please try again.');
    } finally {
      setUpgrading(false);
    }
  };

  if (isActive) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Crown className="w-5 h-5" />
            EventSafe Member
            <Badge variant="default" className="bg-green-600">
              Active
            </Badge>
          </CardTitle>
          <CardDescription>
            You have full access to EventSafe premium features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-green-700">
            <CheckCircle className="w-4 h-4" />
            <span>Guest-to-guest QR check</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-700">
            <CheckCircle className="w-4 h-4" />
            <span>Priority support</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-700">
            <CheckCircle className="w-4 h-4" />
            <span>Enhanced safety features</span>
          </div>
          
          {membership?.currentPeriodEnd && (
            <div className="pt-2 border-t border-green-200">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Calendar className="w-4 h-4" />
                <span>
                  Renews: {membership.currentPeriodEnd.toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-blue-600" />
          Upgrade to EventSafe Member
        </CardTitle>
        <CardDescription>
          Unlock premium features for just £3/year
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Guest-to-guest identity verification</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Priority support and faster responses</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Enhanced safety and verification features</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Support EventSafe's mission</span>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-blue-600">£3</div>
            <div className="text-sm text-gray-500">per year</div>
            <div className="text-xs text-gray-400">
              That's just 25p per month!
            </div>
          </div>

          <Button 
            onClick={onUpgrade || handleUpgrade}
            disabled={upgrading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {upgrading ? 'Starting checkout...' : 'Activate Membership'}
          </Button>
          
          <div className="text-xs text-gray-500 text-center mt-2">
            Secure payment via Stripe • Cancel anytime
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function VenueSubscriptionCard({ 
  plan, 
  venueId, 
  venueEmail,
  onUpgrade 
}: {
  plan?: { active: boolean; currentPeriodEnd?: Date };
  venueId: string;
  venueEmail?: string;
  onUpgrade?: () => void;
}) {
  const [upgrading, setUpgrading] = useState(false);

  const isActive = plan?.active && (
    !plan.currentPeriodEnd || 
    new Date() <= plan.currentPeriodEnd
  );

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const response = await fetch('/api/billing/venue/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          venueId, 
          email: venueEmail,
          returnUrl: window.location.href
        })
      });

      const data = await response.json();
      if (data.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        console.error('Failed to create checkout session:', data.error);
        alert('Failed to start checkout process. Please try again.');
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      alert('Failed to start upgrade process. Please try again.');
    } finally {
      setUpgrading(false);
    }
  };

  if (isActive) {
    return (
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Crown className="w-5 h-5" />
            Venue Pro Plan
            <Badge variant="default" className="bg-purple-600">
              Active
            </Badge>
          </CardTitle>
          <CardDescription>
            Full access to venue management features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-purple-700">
            <CheckCircle className="w-4 h-4" />
            <span>Staff seat management</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-purple-700">
            <CheckCircle className="w-4 h-4" />
            <span>Advanced analytics</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-purple-700">
            <CheckCircle className="w-4 h-4" />
            <span>Priority listing</span>
          </div>
          
          {plan?.currentPeriodEnd && (
            <div className="pt-2 border-t border-purple-200">
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <Calendar className="w-4 h-4" />
                <span>
                  Renews: {plan.currentPeriodEnd.toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-purple-600" />
          Upgrade to Venue Pro
        </CardTitle>
        <CardDescription>
          Unlock professional venue features for £40/month
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Staff seat allocation and management</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Advanced event analytics and insights</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Priority venue listing and promotion</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Dedicated account support</span>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-purple-600">£40</div>
            <div className="text-sm text-gray-500">per month</div>
          </div>

          <Button 
            onClick={onUpgrade || handleUpgrade}
            disabled={upgrading}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {upgrading ? 'Starting checkout...' : 'Activate Pro Plan'}
          </Button>
          
          <div className="text-xs text-gray-500 text-center mt-2">
            Secure payment via Stripe • Cancel anytime
          </div>
        </div>
      </CardContent>
    </Card>
  );
}