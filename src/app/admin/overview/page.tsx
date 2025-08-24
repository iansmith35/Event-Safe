'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import UkHeatmap from '@/components/UkHeatmap';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Zap, 
  Map, 
  Database, 
  GitBranch,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

interface TelemetryData {
  aiKey: boolean;
  googleKey: boolean;
  mapsKey: boolean;
  firebaseConfigured: boolean;
  commit: string;
  time: string;
}

interface AIError {
  id: string;
  event: string;
  data: {
    code?: string;
    detail?: string;
  };
  ts: any;
}

export default function AdminOverview() {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [aiErrors, setAiErrors] = useState<AIError[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  // Fetch telemetry data
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        setTelemetry({
          aiKey: data.ai,
          googleKey: data.ai, // Using same for now
          mapsKey: data.maps,
          firebaseConfigured: data.firebase,
          commit: data.buildTime,
          time: data.now
        });
      } catch (error) {
        console.error('Failed to fetch telemetry:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTelemetry();
  }, []);

  // Subscribe to recent AI errors
  useEffect(() => {
    const q = query(
      collection(db, 'system_logs'),
      where('event', '==', 'ai_error'),
      orderBy('ts', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const errors = snapshot.docs.map(doc => ({
        id: doc.id,
        event: doc.data().event,
        data: doc.data().data || {},
        ts: doc.data().ts
      } as AIError));
      setAiErrors(errors);
    });

    return unsubscribe;
  }, []);

  const handleSeedDemo = async () => {
    setSeeding(true);
    setSeedResult(null);
    
    try {
      const response = await fetch('/api/admin/seed-demo', {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (result.ok) {
        setSeedResult(`✅ Successfully seeded ${result.venuesAdded} venues and ${result.eventsAdded} events`);
      } else {
        setSeedResult(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setSeedResult(`❌ Network error: ${String(error)}`);
    } finally {
      setSeeding(false);
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? 
      <CheckCircle className="w-5 h-5 text-green-500" /> : 
      <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300' : 
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 pt-16 md:pt-20">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pt-16 md:pt-20 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Overview</h1>
          <p className="text-muted-foreground">Live telemetry, error monitoring, and UK event heatmap</p>
        </div>
      </div>

      {/* Telemetry Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4" />
              AI Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(telemetry?.aiKey || false)}`}>
                {telemetry?.aiKey ? 'Available' : 'Missing Key'}
              </span>
              {getStatusIcon(telemetry?.aiKey || false)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Map className="w-4 h-4" />
              Maps API
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(telemetry?.mapsKey || false)}`}>
                {telemetry?.mapsKey ? 'Configured' : 'Missing Key'}
              </span>
              {getStatusIcon(telemetry?.mapsKey || false)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="w-4 h-4" />
              Firebase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(telemetry?.firebaseConfigured || false)}`}>
                {telemetry?.firebaseConfigured ? 'Connected' : 'Missing Config'}
              </span>
              {getStatusIcon(telemetry?.firebaseConfigured || false)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              Build Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-xs font-mono truncate" title={telemetry?.commit}>
                {telemetry?.commit?.slice(0, 8) || 'local'}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {telemetry?.time ? new Date(telemetry.time).toLocaleTimeString() : 'unknown'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent AI Errors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Recent AI Errors
            </CardTitle>
            <CardDescription>
              Last 50 AI service failures ({aiErrors.length} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {aiErrors.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No recent AI errors!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {aiErrors.slice(0, 10).map((error) => (
                  <div key={error.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="destructive" className="text-xs">
                          {error.data.code || 'UNKNOWN'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {error.ts?.toDate ? error.ts.toDate().toLocaleString() : 'Unknown time'}
                        </span>
                      </div>
                      <p className="text-sm truncate" title={error.data.detail}>
                        {error.data.detail || 'No details available'}
                      </p>
                    </div>
                  </div>
                ))}
                {aiErrors.length > 10 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    + {aiErrors.length - 10} more errors...
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Demo Data Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              Demo Data Controls
            </CardTitle>
            <CardDescription>
              Seed demo venues and events across the UK
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={handleSeedDemo}
                disabled={seeding}
                className="max-w-full"
              >
                {seeding ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Seeding...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Seed Demo Data
                  </>
                )}
              </Button>
            </div>
            {seedResult && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm">{seedResult}</p>
              </div>
            )}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• 8 UK venues (Bristol, London, Manchester, Leeds, Birmingham, Cardiff, Newcastle, Brighton)</p>
              <p>• 12 demo events with realistic coordinates</p>
              <p>• Immediate map visualization</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* UK Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="w-5 h-5 text-green-500" />
            UK Events & Venues Heatmap
          </CardTitle>
          <CardDescription>
            Live visualization of upcoming events and active venues across the UK
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UkHeatmap />
        </CardContent>
      </Card>
    </div>
  );
}