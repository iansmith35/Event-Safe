
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Users, PlusCircle, Copy, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type StaffRole = 'Volunteer' | 'Door Staff' | 'Security' | 'Welfare' | 'Host';

interface StaffMember {
    id: string;
    pseudonym: string;
    role: StaffRole;
    accessCode: string;
}

const initialStaff: StaffMember[] = [
    { id: 'staff-001', pseudonym: 'SafetyFirst', role: 'Security', accessCode: 'SEC-8H3J' },
    { id: 'staff-002', pseudonym: 'VibeSetter', role: 'Welfare', accessCode: 'WEL-K4L9' },
];

const availableRoles: StaffRole[] = ['Volunteer', 'Door Staff', 'Security', 'Welfare', 'Host'];

export default function StaffRoleManager() {
    const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
    const [newStaffId, setNewStaffId] = useState('');
    const [newStaffRole, setNewStaffRole] = useState<StaffRole>('Volunteer');
    const { toast } = useToast();

    const addStaffMember = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStaffId.trim()) {
            toast({
                variant: 'destructive',
                title: "Guest ID required",
                description: "Please enter the guest's pseudonym or ID.",
            });
            return;
        }

        const newMember: StaffMember = {
            id: `staff-${Date.now()}`,
            pseudonym: newStaffId,
            role: newStaffRole,
            // In a real app, this code would be securely generated and unique
            accessCode: `${newStaffRole.substring(0,3).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
        };

        setStaff([...staff, newMember]);
        setNewStaffId('');

        toast({
            title: "Staff Member Added",
            description: `${newMember.pseudonym} has been added as ${newMember.role}.`,
        });
    };
    
    const removeStaffMember = (id: string) => {
        setStaff(staff.filter(s => s.id !== id));
        toast({
            title: "Staff Member Removed",
        });
    }

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast({ title: "Copied to clipboard!", description: `Code ${code} is ready to be shared.`});
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users /> Staff Role Management</CardTitle>
                <CardDescription>Build your event team with flexible, tiered role management.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Each host receives 5 free single-use volunteer codes per event. Linked venues get 10. Additional codes are £1 each.</p>
                    <div className="font-bold text-lg mt-1">
                        <span>3 / 5</span> Free Volunteer Codes Used
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Current Team</Label>
                     <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Pseudonym</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {staff.map(member => (
                                    <TableRow key={member.id}>
                                        <TableCell className="font-medium">{member.pseudonym}</TableCell>
                                        <TableCell>{member.role}</TableCell>
                                        <TableCell className="font-mono text-xs">{member.accessCode}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-1 justify-end">
                                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => copyCode(member.accessCode)}><Copy /></Button>
                                                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removeStaffMember(member.id)}><Trash2 /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <form onSubmit={addStaffMember} className="space-y-4">
                     <Label>Add New Staff</Label>
                     <div className="flex flex-col sm:flex-row gap-2">
                        <Input 
                            placeholder="Guest Pseudonym or ID"
                            value={newStaffId}
                            onChange={e => setNewStaffId(e.target.value)}
                        />
                        <Select value={newStaffRole} onValueChange={(value) => setNewStaffRole(value as StaffRole)}>
                            <SelectTrigger className="sm:w-48">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableRoles.map(role => (
                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                     </div>
                     <Button type="submit" className="w-full sm:w-auto">
                        <PlusCircle /> Add to Team
                     </Button>
                </form>

            </CardContent>
        </Card>
    );
}
