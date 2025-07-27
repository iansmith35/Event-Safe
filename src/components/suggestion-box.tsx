
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";

export default function SuggestionBox() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would send this to a backend service or database.
        toast({
            title: "Suggestion Submitted!",
            description: "Thank you for your feedback. We appreciate your input!",
        });
        const form = e.target as HTMLFormElement;
        form.reset();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lightbulb /> Suggestion Box</CardTitle>
                <CardDescription>Have an idea for a new feature? Let us know! We review all suggestions.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="suggestion">Your Suggestion</Label>
                        <Textarea id="suggestion" placeholder="Describe your idea..." required rows={4} />
                    </div>
                    <Button type="submit">Submit Suggestion</Button>
                </form>
            </CardContent>
        </Card>
    );
}
