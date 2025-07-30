
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminReportAnalysis from "./admin-report-analysis";
import AdminStatusSuggester from "./admin-status-suggester";
import AdminAppealHandler from "./admin-appeal-handler";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, X, Ticket, ShieldCheck, Star, Users, Megaphone, ThumbsUp, Scale, UserCheck, KeyRound, Annoyed } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import AdminKudosAnalyzer from "./admin-kudos-analyzer";
import SocialFeed from "./social-feed";
import SuggestionBox from "./suggestion-box";
import FunCourt from "./fun-court";
import AdminVerificationHandler from "./admin-verification-handler";
import FinancialDashboard from "./financial-dashboard";
import EventPreApproval from "./event-pre-approval";
import GuestAlerts from "./guest-alerts";

export default function AdminDashboard() {
  // This state would in reality be populated by fetching flagged users from your database.
  const [flaggedUser, setFlaggedUser] = useState<{reason: string} | null>({ reason: "Biometric match (92%) to a previously banned user." });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Admin Tools</h2>
        <p className="text-muted-foreground">Use AI-powered tools to manage event safety and guest statuses.</p>
      </div>

      {flaggedUser && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="flex justify-between items-center">
            <span>Manual Review Required</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setFlaggedUser(null)}>
              <X className="h-4 w-4" />
            </Button>
          </AlertTitle>
          <AlertDescription>
            A new guest signup has been flagged as a possible duplicate. Reason: {flaggedUser.reason}. Please review in the <strong className="font-semibold">Verification</strong> tab.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="verification" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-6 h-auto sm:h-12">
          <TabsTrigger value="verification"><div className="flex items-center gap-2"><UserCheck className="h-4 w-4" /> Verification</div></TabsTrigger>
          <TabsTrigger value="report-analysis">AI Report Analysis</TabsTrigger>
          <TabsTrigger value="status-suggester">Status Change Suggester</TabsTrigger>
          <TabsTrigger value="appeal-handler">Appeal Request Handler</TabsTrigger>
          <TabsTrigger value="kudos-analyzer"><div className="flex items-center gap-2"><ThumbsUp className="h-4 w-4" /> Kudos Analyzer</div></TabsTrigger>
          <TabsTrigger value="financials" className="flex items-center gap-2">
            <Ticket className="h-4 w-4" /> EventSafe Pay
          </TabsTrigger>
        </TabsList>
        <TabsContent value="verification">
          <AdminVerificationHandler />
        </TabsContent>
        <TabsContent value="report-analysis">
          <AdminReportAnalysis />
        </TabsContent>
        <TabsContent value="status-suggester">
          <AdminStatusSuggester />
        </TabsContent>
        <TabsContent value="appeal-handler">
          <AdminAppealHandler />
        </TabsContent>
        <TabsContent value="kudos-analyzer">
            <AdminKudosAnalyzer />
        </TabsContent>
         <TabsContent value="financials">
          <FinancialDashboard />
        </TabsContent>
      </Tabs>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
            <GuestAlerts />
            <EventPreApproval />
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ShieldCheck /> Post-Event Review</CardTitle>
                    <CardDescription>Log staff notes and review guest behavior after events.</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-8">
                      <div className="max-w-md mx-auto">
                          <h3 className="text-xl font-semibold">Coming Soon: Event Reviews</h3>
                          <p className="text-muted-foreground mt-2">Get a color-coded summary of guest behavior and allow staff to add private notes and tags to maintain a high-quality guest list.</p>
                          <Button className="mt-6" disabled>Notify Me</Button>
                      </div>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users /> Staff Role Management</CardTitle>
                    <CardDescription>Build your event team with flexible, tiered role management.</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-8">
                      <div className="max-w-md mx-auto">
                          <h3 className="text-xl font-semibold">Scalable Staffing Tiers</h3>
                          <p className="text-muted-foreground mt-2">Each host receives 5 free single-use volunteer codes per event. If a venue is also linked, the pool increases to 10 codes. Additional codes can be purchased for £1 each per event.</p>
                          <Button className="mt-6" disabled>Manage Staff & Plan</Button>
                      </div>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Star /> Trust Ratings & Analytics</CardTitle>
                    <CardDescription>Allow venues and guests to rate each other and unlock powerful data.</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-8">
                      <div className="max-w-md mx-auto">
                          <h3 className="text-xl font-semibold">Coming Soon: Trust Data</h3>
                          <p className="text-muted-foreground mt-2">Enable TrustPilot-style ratings and offer enhanced visibility and analytics as a premium feature for venues.</p>
                          <Button className="mt-6" disabled>Notify Me</Button>
                      </div>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Megaphone /> AI Event Promotion</CardTitle>
                    <CardDescription>Use AI to promote your events and drive attendance.</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-8">
                      <div className="max-w-lg mx-auto">
                          <h3 className="text-xl font-semibold">Coming Soon: AI Social Media Promoter</h3>
                          <p className="text-muted-foreground mt-2">Our promoter has two tiers. The basic tier allows you to post your event on the EventSafe feed. The premium tier unlocks continuous, AI-driven social media promotion that creates trendy, engaging posts up until your event date to maximize visibility.</p>
                          <Button className="mt-6" disabled>Notify Me</Button>
                      </div>
                  </CardContent>
              </Card>
            </div>
             <SuggestionBox />
             <FunCourt />
        </div>
        <div className="md:col-span-1">
          <SocialFeed />
        </div>
      </div>
    </div>
  );
}
