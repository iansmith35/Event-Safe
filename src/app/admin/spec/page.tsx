import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, GitBranch } from 'lucide-react';

export default function AdminSpecPage() {
  return (
    <div className="container mx-auto px-6 py-8 pt-16 md:pt-20">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-4">EventSafe Living Specification & Backlog</h1>
          
          <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Living Document</h3>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              This specification is maintained in code and reflects the current agreed-upon feature set and roadmap for EventSafe.
            </p>
            <div className="mt-3 flex items-center gap-4 text-xs text-blue-600 dark:text-blue-400">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last updated: {new Date().toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <GitBranch className="w-3 h-3" />
                Build: {process.env.GITHUB_SHA?.slice(0, 8) || process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) || 'local'}
              </div>
            </div>
          </div>
        </div>

        <hr />

        {/* Core Platform Features */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Core Platform Features</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                🎫 Ticketing & Payments
              </h3>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Revenue Model</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Platform Fee</span>
                    <Badge variant="secondary">8% (absorbed by organiser)</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Processing Fee</span>
                    <Badge variant="secondary">£1 (non-refundable)</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Refund Policy</span>
                    <Badge variant="outline">EventSafe only</Badge>
                  </div>
                </CardContent>
              </Card>

              <ul className="space-y-2 text-sm">
                <li><strong>Platform Fee</strong>: 8% charged to event organisers (not visible to guests)</li>
                <li><strong>Processing Fee</strong>: £1 non-refundable fee per ticket transaction</li>
                <li><strong>Refunds</strong>: Only processed through EventSafe platform, not direct to payment provider</li>
                <li><strong>Currency</strong>: GBP only for UK market focus</li>
                <li><strong>Payment Methods</strong>: Card payments via Stripe integration</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                🔐 Approvals & Safety System
              </h3>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Guest Approval Workflow</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">Auto Approval</Badge>
                      <span className="text-sm">Trusted guests with good history</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Manual Review</Badge>
                      <span className="text-sm">New or flagged profiles require host approval</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">Blacklist</Badge>
                      <span className="text-sm">Platform-wide banned users</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <ul className="space-y-2 text-sm">
                <li><strong>Auto/Manual Modes</strong>: Hosts can choose automatic approval or manual review</li>
                <li><strong>Flagged Users</strong>: System flags suspicious behavior for manual review</li>
                <li><strong>Blacklist System</strong>: Platform-wide bans for serious violations</li>
                <li><strong>Single-Male Ratio</strong>: Optional question for gender balance at events</li>
                <li><strong>Identity Verification</strong>: Progressive verification levels for trust building</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                📱 QR Scanning & Entry
              </h3>
              <ul className="space-y-2 text-sm">
                <li><strong>QR Code Generation</strong>: Unique codes per ticket with fraud protection</li>
                <li><strong>Mobile Scanner</strong>: Host app for door entry management</li>
                <li><strong>Entry Logs</strong>: Complete audit trail of who attended when</li>
                <li><strong>Offline Support</strong>: Scanner works without internet connection</li>
                <li><strong>Real-time Updates</strong>: Live guest list updates during events</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                ⭐ Trust Score System
              </h3>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Scoring Bands (out of 1000)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950 rounded">
                      <span className="text-sm font-medium">Minor Issues</span>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">-50 points</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-950 rounded">
                      <span className="text-sm font-medium">Medium Issues</span>
                      <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">-150 points</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950 rounded">
                      <span className="text-sm font-medium">Serious Issues</span>
                      <Badge variant="destructive">-400 points</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <ul className="space-y-2 text-sm">
                <li><strong>Starting Score</strong>: New users begin with 500/1000 points</li>
                <li><strong>Positive Actions</strong>: Successful event attendance, host reviews boost score</li>
                <li><strong>Negative Actions</strong>: No-shows, complaints, violations reduce score</li>
                <li><strong>Score Visibility</strong>: Hosts see guest scores during approval process</li>
                <li><strong>Recovery Path</strong>: Users can rebuild scores through good behavior</li>
              </ul>
            </div>
          </div>
        </section>

        <hr />

        {/* Demo User Flows */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Demo User Flows</h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-xl font-semibold mb-4">👤 Guest Journey</h3>
              <ul className="space-y-2 text-sm">
                <li><strong>Discovery</strong>: Find events through EventSafe feed or direct links</li>
                <li><strong>Application</strong>: Submit interest with optional questionnaire responses</li>
                <li><strong>Approval</strong>: Wait for host approval (auto or manual)</li>
                <li><strong>Payment</strong>: Complete purchase with platform + processing fees</li>
                <li><strong>Attendance</strong>: Show QR code at venue for entry scanning</li>
                <li><strong>Review</strong>: Rate event and host; receive trust score updates</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">🏠 Host Journey</h3>
              <ul className="space-y-2 text-sm">
                <li><strong>Event Creation</strong>: Set up event details, capacity, and approval settings</li>
                <li><strong>Guest Management</strong>: Review applications and manage guest list</li>
                <li><strong>Entry Management</strong>: Use QR scanner app for door control</li>
                <li><strong>Post-Event</strong>: Review guest behavior and submit feedback</li>
                <li><strong>Analytics</strong>: Access attendance data and revenue reports</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">🏢 Venue Journey</h3>
              <ul className="space-y-2 text-sm">
                <li><strong>Partnership Setup</strong>: Register venue and verify identity</li>
                <li><strong>Event Coordination</strong>: Work with hosts on venue requirements</li>
                <li><strong>Safety Compliance</strong>: Ensure platform safety standards are met</li>
                <li><strong>Revenue Sharing</strong>: Receive agreed percentage of event revenue</li>
                <li><strong>Performance Tracking</strong>: Access venue utilization analytics</li>
              </ul>
            </div>
          </div>
        </section>

        <hr />

        {/* Legal Framework */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Legal Framework</h2>
          
          <div>
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              📋 Terms & Liability
            </h3>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Platform Protections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <strong>No Refunds Policy:</strong> EventSafe not liable for platform downtime affecting events
                </div>
                <div className="text-sm">
                  <strong>Dispute Deterrent:</strong> Legal costs coverage clause to prevent frivolous claims  
                </div>
                <div className="text-sm">
                  <strong>GDPR Compliance:</strong> Full UK GDPR compliance for data handling
                </div>
                <div className="text-sm">
                  <strong>Currency:</strong> GBP transactions only for regulatory simplicity
                </div>
              </CardContent>
            </Card>

            <ul className="space-y-2 text-sm">
              <li><strong>Platform Liability</strong>: Limited liability for technical issues or downtime</li>
              <li><strong>User Disputes</strong>: Built-in mediation system before external escalation</li>
              <li><strong>Data Protection</strong>: UK GDPR compliant data processing and storage</li>
              <li><strong>Payment Processing</strong>: PCI DSS compliant via Stripe integration</li>
              <li><strong>Content Moderation</strong>: Clear community guidelines with enforcement</li>
            </ul>
          </div>
        </section>

        <hr />

        {/* Technical Roadmap */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Technical Roadmap</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">🚀 Phase 1 (Current)</h3>
              <ul className="space-y-1 text-sm">
                <li>✅ Basic event creation and guest management</li>
                <li>✅ QR code generation and scanning</li>
                <li>✅ Trust score foundation</li>
                <li>✅ Admin monitoring dashboard</li>
                <li>✅ Demo data and UK heatmap</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">🔄 Phase 2 (Next 3 months)</h3>
              <ul className="space-y-1 text-sm">
                <li><strong>Stripe Connect Splits</strong>: Automatic revenue distribution to venues</li>
                <li><strong>Postcode Radius Search</strong>: Location-based event discovery</li>
                <li><strong>Advanced Analytics</strong>: Host and venue performance dashboards</li>
                <li><strong>Mobile Apps</strong>: Native iOS/Android apps for better UX</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">🎯 Phase 3 (6-12 months)</h3>
              <ul className="space-y-1 text-sm">
                <li><strong>Admin AI Console</strong> (<code>/admin/ai</code>): AI-powered moderation and insights</li>
                <li><strong>Premium Venue Features</strong>: Enhanced analytics and promotion tools</li>
                <li><strong>API Platform</strong>: Third-party integrations and partnerships</li>
                <li><strong>Multi-city Expansion</strong>: Scale beyond UK to EU markets</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">🌟 Future Considerations</h3>
              <ul className="space-y-1 text-sm">
                <li><strong>Blockchain Identity</strong>: Decentralized identity verification</li>
                <li><strong>Social Features</strong>: Friend connections and social discovery</li>
                <li><strong>Enterprise Tools</strong>: Large venue and event company solutions</li>
                <li><strong>International</strong>: Multi-currency and global expansion</li>
              </ul>
            </div>
          </div>
        </section>

        <hr />

        {/* Success Metrics */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Success Metrics</h2>
          
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold mb-4">📊 Key Performance Indicators</h3>
              <ul className="space-y-2 text-sm">
                <li><strong>Monthly Active Users</strong>: Guest and host engagement</li>
                <li><strong>Event Success Rate</strong>: % of events that complete successfully</li>
                <li><strong>Trust Score Distribution</strong>: Platform safety and quality metrics</li>
                <li><strong>Revenue Growth</strong>: MRR and transaction volume trends</li>
                <li><strong>Support Tickets</strong>: Platform reliability and user satisfaction</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">🎯 Target Metrics (6 months)</h3>
              <ul className="space-y-2 text-sm">
                <li>1,000+ monthly active hosts</li>
                <li>10,000+ monthly active guests</li>
                <li>95%+ event completion rate</li>
                <li>Average trust score &gt;750/1000</li>
                <li>Less than 2% support ticket rate</li>
              </ul>
            </div>
          </div>
        </section>

        <hr />

        {/* Document Status */}
        <div className="mt-12 p-6 bg-muted rounded-lg border-l-4 border-primary">
          <div className="flex items-start gap-3">
            <FileText className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Document Status</h3>
              <p className="text-sm text-muted-foreground mb-3">
                This living specification captures our current understanding and agreements about the EventSafe platform.
                It evolves with our product development and market learnings.
              </p>
              <div className="text-xs space-y-1">
                <div>📝 <strong>Updates:</strong> Modified through code commits for traceability</div>
                <div>🔄 <strong>Review Cycle:</strong> Updated with each major feature release</div>
                <div>📋 <strong>Stakeholders:</strong> Product, Engineering, Business teams</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}