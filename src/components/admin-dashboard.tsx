"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminReportAnalysis from "./admin-report-analysis";
import AdminStatusSuggester from "./admin-status-suggester";
import AdminAppealHandler from "./admin-appeal-handler";

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-4">Admin Tools</h2>
      <p className="text-muted-foreground mb-6">Use AI-powered tools to manage event safety and guest statuses.</p>
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
