'use client';

import AdminNav from '@/components/AdminNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Zap, Map, Database, Activity, AlertCircle, Monitor, Trash2 } from 'lucide-react';
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
  data: Record<string, unknown>;
  ts: string;
}

interface AdminSession {
  id: string;
  deviceInfo: string;
  createdAt: string;
  lastSeenAt: string;
  ipHash: string;
  isCurrent: boolean;
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

async function fetchAdminSessions(): Promise<AdminSession[]> {
  try {
    // Get current user info from Firebase Auth (simplified)
    // In reality, you'd get this from useAuth hook or similar
    const user = {
      uid: 'admin-uid', // This would come from Firebase Auth
      email: 'ian@ishe-ltd.co.uk' // This would come from Firebase Auth
    };
    
    const response = await fetch(`/api/admin/sessions/list?userId=${user.uid}&userEmail=${user.email}`, {
      headers: {
        'Authorization': 'Bearer dummy-token' // Would be real Firebase ID token
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch sessions');
    }
    
    const data = await response.json();
    return data.ok ? data.sessions : [];
  } catch (error) {
    console.error('Failed to fetch admin sessions:', error);
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
  const [activeSessions, setActiveSessions] = useState<AdminSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [health, logs, sessions] = await Promise.all([
        fetchHealthStatus(),
        fetchRecentLogs(),
        fetchAdminSessions()
      ]);
      setHealthData(health);
      setRecentLogs(logs);
      setActiveSessions(sessions);
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

  const handleRevokeOtherSessions = async () => {
    if (!confirm('Are you sure you want to sign out all other sessions?')) return;
    
    setSessionLoading(true);
    try {
      const user = {
        uid: 'admin-uid', // This would come from Firebase Auth
        email: 'ian@ishe-ltd.co.uk' // This would come from Firebase Auth
      };
      
      const response = await fetch('/api/admin/sessions/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.uid,
          userEmail: user.email,
          revokeAll: false
        })
      });
      
      if (response.ok) {
        // Refresh sessions list
        const sessions = await fetchAdminSessions();
        setActiveSessions(sessions);
      }
    } catch (error) {
      console.error('Failed to revoke sessions:', error);
    } finally {
      setSessionLoading(false);
    }
  };

  const handleLogoutEverywhere = async () => {
    if (!confirm('Are you sure you want to sign out from all devices? You will need to sign in again.')) return;
    
    setSessionLoading(true);
    try {
      const user = {
        uid: 'admin-uid', // This would come from Firebase Auth
        email: 'ian@ishe-ltd.co.uk' // This would come from Firebase Auth
      };
      
      const response = await fetch('/api/admin/sessions/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.uid,
          userEmail: user.email,
          revokeAll: true
        })
      });
      
      if (response.ok) {
        // Redirect to login since all sessions are revoked
        window.location.href = '/admin/login';
      }
    } catch (error) {
      console.error('Failed to logout everywhere:', error);
    } finally {
      setSessionLoading(false);
    }
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <AdminNav />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                  Signed in as ian@ishe-ltd.co.uk • {activeSessions.length} active session{activeSessions.length !== 1 ? 's' : ''}
                </p>
              </div>
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

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Active Sessions
          </CardTitle>
          <CardDescription>Manage your active admin sessions across devices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeSessions.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No active sessions found
            </div>
          ) : (
            <div className="space-y-3">
              {activeSessions.slice(0, 10).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      <span className="font-medium text-sm">
                        {session.deviceInfo}
                        {session.isCurrent && (
                          <Badge variant="secondary" className="ml-2 text-xs">Current</Badge>
                        )}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Created: {new Date(session.createdAt).toLocaleString()} • 
                      Last seen: {new Date(session.lastSeenAt).toLocaleString()} • 
                      IP: {session.ipHash}
                    </div>
                  </div>
                </div>
              ))}
              {activeSessions.length > 10 && (
                <div className="text-center text-muted-foreground text-sm">
                  ... and {activeSessions.length - 10} more sessions
                </div>
              )}
            </div>
          )}
          
          {activeSessions.length > 1 && (
            <div className="flex gap-2 pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRevokeOtherSessions}
                disabled={sessionLoading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Sign out other sessions
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleLogoutEverywhere}
                disabled={sessionLoading}
              >
                Log out everywhere
              </Button>
            </div>
          )}
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
              {recentLogs.slice(0, 10).map((log: LogEntry) => (
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
      </div>
    </div>
  );
}