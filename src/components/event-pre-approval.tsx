
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { KeyRound, User, Check, X, Eye } from 'lucide-react';
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

type RequestStatus = 'Pending' | 'Approved' | 'Declined';

interface ApprovalRequest {
    id: string;
    guestName: string;
    guestAvatar: string;
    guestAvatarHint: string;
    status: RequestStatus;
}

const initialRequests: ApprovalRequest[] = [
    { id: 'req-001', guestName: 'Vixen', guestAvatar: 'https://images.unsplash.com/photo-1596644230693-bdfc6f50531b?q=80&w=400', guestAvatarHint: 'woman intense', status: 'Pending' },
    { id: 'req-002', guestName: 'AgentIndigo', guestAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400', guestAvatarHint: 'female person', status: 'Pending' },
    { id: 'req-003', guestName: 'ShadowBanned', guestAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400', guestAvatarHint: 'man face', status: 'Pending' },
];


export default function EventPreApproval() {
    const [preApprovalEnabled, setPreApprovalEnabled] = useState(false);
    const [reason, setReason] = useState("To maintain a balanced ratio, all single gentlemen are required to seek pre-approval for this event.");
    const [requests, setRequests] = useState<ApprovalRequest[]>(initialRequests);
    const { toast } = useToast();

    const handleRequest = (id: string, decision: 'Approved' | 'Declined') => {
        setRequests(requests.map(req => req.id === id ? {...req, status: decision} : req));
        toast({
            title: `Request ${decision}`,
            description: `The guest has been notified of your decision.`
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><KeyRound /> Event Pre-Approval</CardTitle>
                <CardDescription>Optionally require guests to request approval before they can purchase tickets. Useful for managing demographics or for exclusive events.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                    <Switch
                        id="pre-approval-switch"
                        checked={preApprovalEnabled}
                        onCheckedChange={setPreApprovalEnabled}
                    />
                    <Label htmlFor="pre-approval-switch">Enable Pre-Approval for this Event</Label>
                </div>

                {preApprovalEnabled && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="approval-reason">Reason for Pre-Approval</Label>
                            <Textarea
                                id="approval-reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Explain why guests need to be pre-approved..."
                                rows={3}
                            />
                            <p className="text-xs text-muted-foreground">This text will be shown to guests when they try to access the event.</p>
                        </div>
                        
                        <div className="space-y-4">
                            <Label>Guest Preview</Label>
                            <Alert>
                                <Eye className="h-4 w-4" />
                                <AlertTitle>Pre-Approval Required</AlertTitle>
                                <AlertDescription>
                                    <p className="mb-4">{reason}</p>
                                    <Button disabled>Request Approval</Button>
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
                                                <TableCell className="text-right">
                                                    {req.status === 'Pending' ? (
                                                        <div className="flex gap-2 justify-end">
                                                            <Button size="icon" variant="outline" className="h-8 w-8 bg-background hover:bg-chart-2/10 border-chart-2/50 text-chart-2" onClick={() => handleRequest(req.id, 'Approved')}><Check className="h-4 w-4" /></Button>
                                                            <Button size="icon" variant="outline" className="h-8 w-8 bg-background hover:bg-destructive/10 border-destructive/50 text-destructive" onClick={() => handleRequest(req.id, 'Declined')}><X className="h-4 w-4"/></Button>
                                                            <Button size="icon" variant="outline" className="h-8 w-8"><User className="h-4 w-4" /></Button>
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
