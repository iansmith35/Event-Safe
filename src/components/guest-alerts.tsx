
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Bell, Clock, Send, Trash2, PlusCircle, BellRing } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface ScheduledAlert {
    id: number;
    message: string;
    time: string;
}

export default function GuestAlerts() {
    const [immediateMessage, setImmediateMessage] = useState('');
    const [scheduledMessage, setScheduledMessage] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [scheduledAlerts, setScheduledAlerts] = useState<ScheduledAlert[]>([]);
    const { toast } = useToast();

    const handleSendImmediate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!immediateMessage) return;
        
        // In a real app, this would trigger a push notification via FCM
        toast({
            title: "Alert Sent Immediately!",
            description: `Message: "${immediateMessage}"`,
        });
        setImmediateMessage('');
    };

    const handleScheduleAlert = (e: React.FormEvent) => {
        e.preventDefault();
        if (!scheduledMessage || !scheduledTime) return;

        const newAlert: ScheduledAlert = {
            id: Date.now(),
            message: scheduledMessage,
            time: scheduledTime,
        };

        setScheduledAlerts([...scheduledAlerts, newAlert].sort((a,b) => a.time.localeCompare(b.time)));
        
        toast({
            title: "Alert Scheduled",
            description: `"${newAlert.message}" will be sent at ${newAlert.time}.`,
        });

        setScheduledMessage('');
        setScheduledTime('');
    };
    
    const cancelAlert = (id: number) => {
        const alertToCancel = scheduledAlerts.find(a => a.id === id);
        setScheduledAlerts(scheduledAlerts.filter(a => a.id !== id));
        toast({
            title: "Alert Canceled",
            description: `The scheduled alert "${alertToCancel?.message}" has been removed.`,
            variant: "destructive",
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BellRing /> Guest Alerts</CardTitle>
                <CardDescription>Send real-time or scheduled announcements to all guests checked into your event.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Immediate Alert */}
                <form onSubmit={handleSendImmediate} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="immediate-alert" className="flex items-center gap-2 font-semibold"><Send /> Send Immediate Alert</Label>
                        <Textarea
                            id="immediate-alert"
                            value={immediateMessage}
                            onChange={(e) => setImmediateMessage(e.target.value)}
                            placeholder="e.g., The main act is starting in 5 minutes on the main stage!"
                            rows={3}
                        />
                    </div>
                    <Button type="submit" disabled={!immediateMessage}>Send Now</Button>
                </form>

                <Separator />

                {/* Scheduled Alerts */}
                <div className="space-y-6">
                     <h3 className="font-semibold flex items-center gap-2"><Clock /> Scheduled Alerts</h3>
                     {scheduledAlerts.length > 0 && (
                        <Card>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Time</TableHead>
                                        <TableHead>Message</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {scheduledAlerts.map(alert => (
                                        <TableRow key={alert.id}>
                                            <TableCell><Badge variant="outline">{alert.time}</Badge></TableCell>
                                            <TableCell className="font-medium">{alert.message}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => cancelAlert(alert.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                     )}
                     
                     <form onSubmit={handleScheduleAlert} className="space-y-4 p-4 bg-muted/50 rounded-lg">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="scheduled-message">Message</Label>
                                <Input 
                                    id="scheduled-message"
                                    value={scheduledMessage}
                                    onChange={e => setScheduledMessage(e.target.value)}
                                    placeholder="e.g., Rope demo in the lounge"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="scheduled-time">Time (24h format)</Label>
                                <Input 
                                    id="scheduled-time"
                                    type="time"
                                    value={scheduledTime}
                                    onChange={e => setScheduledTime(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <Button type="submit" variant="secondary">
                            <PlusCircle className="mr-2" /> Schedule Alert
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}
