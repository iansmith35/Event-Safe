'use client';

import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Star, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { getScoreDisplay } from '@/lib/score';

interface VenueScoreProps {
  venueId?: string;
  score?: number;
  scoreUpdatedAt?: Date;
  showDetails?: boolean;
  className?: string;
}

interface ScoreBreakdown {
  base: number;
  eventsCompleted: number;
  refundPenalty: number;
  disputePenalty: number;
  safetyPenalty: number;
  bonuses: number;
}

export function VenueScore({ 
  venueId, 
  score, 
  scoreUpdatedAt, 
  showDetails = false, 
  className = '' 
}: VenueScoreProps) {
  const [currentScore, setCurrentScore] = useState<number>(score || 750);
  const [breakdown, setBreakdown] = useState<ScoreBreakdown | null>(null);
  const [loading, setLoading] = useState(false);

  // If score is provided as prop, use it; otherwise fetch from API
  useEffect(() => {
    if (score !== undefined) {
      setCurrentScore(score);
      return;
    }

    if (venueId && showDetails) {
      fetchVenueScore();
    }
  }, [venueId, score, showDetails]);

  const fetchVenueScore = async () => {
    if (!venueId) return;
    
    setLoading(true);
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate fetching score data
      setTimeout(() => {
        setCurrentScore(score || 750);
        setBreakdown({
          base: 750,
          eventsCompleted: 50,
          refundPenalty: -10,
          disputePenalty: 0,
          safetyPenalty: 0,
          bonuses: 105
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch venue score:', error);
      setLoading(false);
    }
  };

  const { text, color, level } = getScoreDisplay(currentScore);

  if (loading && showDetails) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-6 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  const ScoreContent = () => (
    <div className={`flex items-center gap-2 ${className}`}>
      <Star className="w-4 h-4 text-yellow-500" />
      <span className={`font-semibold ${color}`}>{text}</span>
      <Badge variant="secondary" className="text-xs">
        {level}
      </Badge>
      {showDetails && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <div className="text-sm space-y-1">
                <p className="font-medium">Score Breakdown</p>
                {breakdown && (
                  <>
                    <div className="flex justify-between">
                      <span>Base Score:</span>
                      <span>{breakdown.base}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Events Bonus:</span>
                      <span className="text-green-600">+{breakdown.eventsCompleted}</span>
                    </div>
                    {breakdown.refundPenalty < 0 && (
                      <div className="flex justify-between">
                        <span>Refund Penalty:</span>
                        <span className="text-red-600">{breakdown.refundPenalty}</span>
                      </div>
                    )}
                    {breakdown.disputePenalty < 0 && (
                      <div className="flex justify-between">
                        <span>Dispute Penalty:</span>
                        <span className="text-red-600">{breakdown.disputePenalty}</span>
                      </div>
                    )}
                    {breakdown.safetyPenalty < 0 && (
                      <div className="flex justify-between">
                        <span>Safety Penalty:</span>
                        <span className="text-red-600">{breakdown.safetyPenalty}</span>
                      </div>
                    )}
                  </>
                )}
                {scoreUpdatedAt && (
                  <p className="text-xs text-gray-500 mt-2">
                    Last updated: {scoreUpdatedAt.toLocaleDateString()}
                  </p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );

  if (showDetails) {
    return (
      <Card className="inline-block">
        <CardContent className="p-3">
          <ScoreContent />
        </CardContent>
      </Card>
    );
  }

  return <ScoreContent />;
}

// Simple inline score display for cards/lists
export function VenueScoreBadge({ score = 750 }: { score?: number }) {
  const { text, color } = getScoreDisplay(score);
  
  return (
    <div className="flex items-center gap-1 text-sm">
      <Star className="w-3 h-3 text-yellow-500" />
      <span className={`font-medium ${color}`}>{text}</span>
    </div>
  );
}