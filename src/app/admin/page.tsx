'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Shield, Zap, Map, Database, Activity, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HealthData {
  ok: boolean;
  ai: boolean;
  maps: boolean;
  firebase: boolean;
  buildTime: string;
  now: string;
  error?: string;
}

interface LogEntry {
  id: string;
  event: string;
  data: Record<string, any>;
  ts: string;
}

async function fetchHealthStatus(): Promise<HealthData> {
  try {
    const response = await fetch('/api/health', {
      cache: 'no-cache'
    });
    return await response.json();
  } catch {
    return { ok: false, ai: false, maps: false, firebase: false, buildTime: 'unknown', now: new Date().toISOString(), error: 'FETCH_FAILED' };
  }
}

async function fetchRecentLogs(): Promise<LogEntry[]> {
  try {
    // For now, return empty array since we need to handle Firestore on client-side
    // In a real implementation, we'd have an API endpoint for this
    return [];
  } catch (error) {
    console.error('Failed to fetch logs:', error);
    return [];
  }
}

function StatusBadge({ status, label }: { status: boolean; label: string }) {
  return (
    <Badge variant={status ? 'default' : 'destructive'} className="w-full justify-center">
      {status ? '✅' : '❌'} {label}
    </Badge>
  );
}

function StatusIcon({ status }: { status: boolean }) {
  return status ? (
    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
  ) : (
    <div className="w-3 h-3 bg-red-500 rounded-full" />
  );
}

export default function AdminPage() {
  const [healthData, setHealthData] = useState<HealthData>({
    ok: false,
    ai: false,
    maps: false,
    firebase: false,
    buildTime: 'loading...',
    now: new Date().toISOString()
  });
  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [health, logs] = await Promise.all([
        fetchHealthStatus(),
        fetchRecentLogs()
      ]);
      setHealthData(health);
      setRecentLogs(logs);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleTestAI = () => {
    window.open('/api/test/ai', '_blank');
  };

  const handleViewHealth = () => {
    window.open('/api/health', '_blank');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6 pt-16 md:pt-20">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Loading system status...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 pt-16 md:pt-20">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">System status and operational monitoring</p>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Status</CardTitle>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <StatusIcon status={healthData.ai || false} />
            </div>
          </CardHeader>
          <CardContent>
            <StatusBadge status={healthData.ai || false} label={healthData.ai ? 'Available' : 'Unavailable'} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maps</CardTitle>
            <div className="flex items-center gap-2">
              <Map className="w-4 h-4 text-blue-500" />
              <StatusIcon status={healthData.maps || false} />
            </div>
          </CardHeader>
          <CardContent>
            <StatusBadge status={healthData.maps || false} label={healthData.maps ? 'Available' : 'Unavailable'} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Firebase</CardTitle>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-orange-500" />
              <StatusIcon status={healthData.firebase || false} />
            </div>
          </CardHeader>
          <CardContent>
            <StatusBadge status={healthData.firebase || false} label={healthData.firebase ? 'Connected' : 'Disconnected'} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System</CardTitle>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" />
              <StatusIcon status={healthData.ok || false} />
            </div>
          </CardHeader>
          <CardContent>
            <StatusBadge status={healthData.ok || false} label={healthData.ok ? 'Healthy' : 'Issues'} />
          </CardContent>
        </Card>
      </div>

      {/* Build Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Build Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Build:</span>
            <code className="bg-muted px-2 py-1 rounded text-xs">
              {healthData.buildTime || 'unknown'}
            </code>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last Check:</span>
            <span>{healthData.now ? new Date(healthData.now).toLocaleString() : 'unknown'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Service Tests</CardTitle>
            <CardDescription>Run diagnostic tests on system components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full" 
              onClick={handleTestAI}
            >
              <Zap className="w-4 h-4 mr-2" />
              Test AI Service
            </Button>
            <Button variant="outline" className="w-full" disabled>
              <Map className="w-4 h-4 mr-2" />
              Test Maps (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>System management utilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleViewHealth}
            >
              <Activity className="w-4 h-4 mr-2" />
              View Health JSON
            </Button>
            <Button variant="outline" className="w-full" disabled>
              <Database className="w-4 h-4 mr-2" />
              Clear Cache (Coming Soon)
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Errors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Recent System Logs
          </CardTitle>
          <CardDescription>Last 50 system events from Firestore</CardDescription>
        </CardHeader>
        <CardContent>
          {recentLogs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No recent logs found. This could mean:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Firestore collection &quot;system_logs&quot; doesn&apos;t exist yet</li>
                <li>No events have been logged recently</li>
                <li>Connection issues with Firestore</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recentLogs.slice(0, 10).map((log: any) => (
                <div key={log.id} className="border rounded p-3 text-sm">
                  <div className="flex justify-between items-start mb-1">
                    <Badge variant="outline" className="text-xs">
                      {log.event}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.ts).toLocaleString()}
                    </span>
                  </div>
                  {Object.keys(log.data || {}).length > 0 && (
                    <div className="mt-2">
                      <code className="bg-muted p-2 rounded block text-xs overflow-x-auto">
                        {JSON.stringify(log.data, null, 2)}
                      </code>
                    </div>
                  )}
                </div>
              ))}
              {recentLogs.length > 10 && (
                <div className="text-center text-muted-foreground text-sm pt-2">
                  ... and {recentLogs.length - 10} more entries
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}