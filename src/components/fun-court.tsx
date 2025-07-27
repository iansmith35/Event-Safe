
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gavel, Scale } from "lucide-react";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export default function FunCourt() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Scale /> EventSafe Resolution Center</CardTitle>
                <CardDescription>Anonymized, AI-driven dispute resolution for educational purposes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Alert variant="destructive">
                    <Gavel className="h-4 w-4" />
                    <AlertTitle>Legal Disclaimer</AlertTitle>
                    <AlertDescription>
                       This feature is for educational and entertainment purposes only and is not legally binding. It does not constitute real legal advice. EventSafe is not a party to any disputes.
                    </AlertDescription>
                </Alert>

                <div className="p-4 border rounded-lg space-y-4">
                    <h4 className="font-semibold">Sample Case</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="font-mono text-xs">Case ID: ES-C24-001</span>
                            <Badge variant="secondary">Judgment Rendered</Badge>
                        </div>
                        <p className="text-sm">
                            <span className="font-semibold">Complaint:</span> A host alleges a venue failed to provide the agreed-upon number of security staff, leading to gate-crashers.
                        </p>
                        <p className="text-sm">
                            <span className="font-semibold">Defense:</span> The venue argues the host's event marketing attracted a larger-than-expected crowd, exceeding the scope of the original agreement.
                        </p>
                        <div className="pt-2">
                            <h5 className="font-semibold text-primary">AI Judge's Verdict (Summary):</h5>
                            <p className="text-sm text-muted-foreground">
                                "While the venue is responsible for staffing, the host has a duty to provide accurate attendance estimates. Judgment finds shared responsibility. Recommendation: Future agreements must include a 'surge capacity' clause, outlining procedures and costs if attendance exceeds projections by over 20%."
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground">
                    This premium feature allows a complainant to file a case for £1. The accused party is invited to reply for free. Both sides are represented by an AI lawyer to argue their case based on provided statements.
                </p>

                <Button disabled className="w-full">
                    Coming Soon: File a Case
                </Button>
            </CardContent>
        </Card>
    );
}
