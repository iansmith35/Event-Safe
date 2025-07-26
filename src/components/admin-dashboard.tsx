"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminReportAnalysis from "./admin-report-analysis";
import AdminStatusSuggester from "./admin-status-suggester";
import AdminAppealHandler from "./admin-appeal-handler";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, X } from "lucide-react";
import { Button } from "./ui/button";

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
            A new guest signup has been flagged as a possible duplicate. Reason: {flaggedUser.reason}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="report-analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-10">
          <TabsTrigger value="report-analysis">AI Report Analysis</TabsTrigger>
          <TabsTrigger value="status-suggester">Status Change Suggester</TabsTrigger>
          <TabsTrigger value="appeal-handler">Appeal Request Handler</TabsTrigger>
        </TabsList>
        <TabsContent value="report-analysis">
          <AdminReportAnalysis />
        </TabsContent>
        <TabsContent value="status-suggester">
          <AdminStatusSuggester />
        </TabsContent>
        <TabsContent value="appeal-handler">
          <AdminAppealHandler />
        </TabsContent>
      </Tabs>
    </div>
  );
}
