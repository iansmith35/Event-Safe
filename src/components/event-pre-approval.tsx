
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { KeyRound, User, Check, X, Eye, ThumbsUp, Ban } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { suspendGuestFromEvent } from '@/ai/flows/suspend-guest';

type RequestStatus = 'Pending' | 'Approved' | 'Declined';

interface InterestRequest {
    id: string;
    guestName: string;
    guestAvatar: string;
    guestAvatarHint: string;
    status: RequestStatus;
}

const initialRequests: InterestRequest[] = [
    { id: 'req-001', guestName: 'Vixen', guestAvatar: 'https://images.unsplash.com/photo-1596644230693-bdfc6f50531b?q=80&w=400', guestAvatarHint: 'woman intense', status: 'Pending' },
    { id: 'req-002', guestName: 'AgentIndigo', guestAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400', guestAvatarHint: 'female person', status: 'Pending' },
    { id: 'req-003', guestName: 'ShadowBanned', guestAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400', guestAvatarHint: 'man face', status: 'Pending' },
];


export default function EventPreApproval() {
    const [interestEnabled, setInterestEnabled] = useState(false);
    const [reason, setReason] = useState("To maintain a balanced ratio, all single gentlemen are required to express interest for this event.");
    const [requests, setRequests] = useState<InterestRequest[]>(initialRequests);
    const { toast } = useToast();

    const handleRequest = (id: string, decision: 'Approved' | 'Declined') => {
        setRequests(requests.map(req => req.id === id ? {...req, status: decision} : req));
        
        let toastDescription = `The guest has been notified of your decision.`;
        if (decision === 'Declined') {
            toastDescription = `The guest has been politely informed that numbers are limited and they have been placed on a waitlist.`;
        }

        toast({
            title: `Request ${decision}`,
            description: toastDescription
        });
    }

    const handleSuspend = async (guestId: string) => {
        // In a real app, you'd have the eventId.
        const eventId = 'EVENT-123';
        const suspensionReason = 'Guest has expressed interest in multiple limited-capacity events without attending.';

        // This is a simulation. In a real app, you'd get the result and use it.
        // const { guestNotification, logEntry } = await suspendGuestFromEvent({ guestId, eventId, reason: suspensionReason });
        
        toast({
            title: "Guest Suspended from Event",
            description: `${guestId} has been suspended from this event only. A polite notification has been sent. Reason logged: "${suspensionReason}"`,
            duration: 7000,
        });
        
        // Remove the request from the list
        setRequests(requests.filter(req => req.id !== guestId));
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ThumbsUp /> Expression of Interest</CardTitle>
                <CardDescription>Optionally require guests to express interest before they can access an event. Useful for gauging interest, managing demographics, creating waitlists, or for exclusive events.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                    <Switch
                        id="interest-switch"
                        checked={interestEnabled}
                        onCheckedChange={setInterestEnabled}
                    />
                    <Label htmlFor="interest-switch">Enable "Expression of Interest" for this Event</Label>
                </div>

                {interestEnabled && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="interest-reason">Message to Guests</Label>
                            <Textarea
                                id="interest-reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Explain why guests need to express interest..."
                                rows={3}
                            />
                            <p className="text-xs text-muted-foreground">This text will be shown to guests when they try to access the event page.</p>
                        </div>
                        
                        <div className="space-y-4">
                            <Label>Guest Preview</Label>
                            <Alert>
                                <Eye className="h-4 w-4" />
                                <AlertTitle>Expression of Interest Required</AlertTitle>
                                <AlertDescription>
                                    <p className="mb-4">{reason}</p>
                                    <Button disabled>Express Interest</Button>
                                </AlertDescription>
                            </Alert>
                        </div>
                        
                        <div className="space-y-4">
                             <Label>Incoming Requests</Label>
                             <Card>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Guest</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {requests.map(req => (
                                            <TableRow key={req.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={req.guestAvatar} data-ai-hint={req.guestAvatarHint} />
                                                            <AvatarFallback>{req.guestName.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium">{req.guestName}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        req.status === 'Approved' ? 'default' :
                                                        req.status === 'Declined' ? 'destructive' :
                                                        'secondary'
                                                    }>{req.status}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {req.status === 'Pending' ? (
                                                        <div className="flex gap-1 justify-end">
                                                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleRequest(req.id, 'Approved')}><Check className="h-4 w-4 text-chart-2" /></Button>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleRequest(req.id, 'Declined')}><X className="h-4 w-4 text-destructive"/></Button>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleSuspend(req.id)}><Ban className="h-4 w-4 text-muted-foreground" /></Button>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8"><User className="h-4 w-4" /></Button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">Actioned</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                             </Card>
                        </div>

                    </div>
                )}
            </CardContent>
        </Card>
    );
}
