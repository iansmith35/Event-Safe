
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "./ui/badge";
import { BarChart, BookOpen, Briefcase, Landmark, MinusCircle, PlusCircle, TrendingDown, TrendingUp } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Bar, CartesianGrid, XAxis, YAxis, BarChart as RechartsBarChart } from "recharts";

// Mock data simulating data fetched from Firestore and tagged for ESAFE
const financialData = {
    turnover: [
        { source: 'Guest Signup Fees', amount: 12500, date: '2024-07-31' },
        { source: 'Host Event Fees', amount: 2500, date: '2024-07-31' },
        { source: 'Promo Code Sales', amount: 500, date: '2024-07-31' },
    ],
    expenses: [
        { item: 'Cloud Server Costs', amount: 1500, category: 'IT & Software' },
        { item: 'Stripe Processing Fees', amount: 450, category: 'Bank, credit card and other financial charges' },
        { item: 'AI API Usage (Genkit)', amount: 800, category: 'IT & Software' },
        { item: 'Legal Consultation', amount: 1200, category: 'Professional fees' },
    ]
};

const totalTurnover = financialData.turnover.reduce((acc, item) => acc + item.amount, 0);
const totalExpenses = financialData.expenses.reduce((acc, item) => acc + item.amount, 0);
const netProfit = totalTurnover - totalExpenses;

const chartData = [
  { month: "Jan", turnover: 4000, expenses: 2400 },
  { month: "Feb", turnover: 3000, expenses: 1398 },
  { month: "Mar", turnover: 2000, expenses: 9800 },
  { month: "Apr", turnover: 2780, expenses: 3908 },
  { month: "May", turnover: 1890, expenses: 4800 },
  { month: "Jun", turnover: 2390, expenses: 3800 },
  { month: "Jul", turnover: 13490, expenses: 4300 },
]

export default function FinancialDashboard() {
  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>EventSafe Financial Overview</CardTitle>
                <CardDescription>
                    A summary of financial activities for the <strong>ESAFE</strong> class. This data is structured to align with HMRC self-assessment categories for your convenience.
                </CardDescription>
            </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Turnover</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">£{totalTurnover.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Total income generated this tax year</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Allowable Expenses</CardTitle>
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">£{totalExpenses.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Total business costs this tax year</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                    <Landmark className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${netProfit > 0 ? 'text-chart-2' : 'text-destructive'}`}>
                        £{netProfit.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Turnover minus allowable expenses</p>
                </CardContent>
            </Card>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart /> Monthly Performance</CardTitle>
                <CardDescription>A visual breakdown of turnover vs. expenses over the current financial year.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{
                    turnover: { label: "Turnover", color: "hsl(var(--chart-2))" },
                    expenses: { label: "Expenses", color: "hsl(var(--chart-4))" }
                }} className="h-64">
                    <RechartsBarChart data={chartData} accessibilityLayer>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                         <YAxis
                            tickFormatter={(value) => `£${Number(value) / 1000}k`}
                         />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="turnover" fill="var(--color-turnover)" radius={4} />
                        <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
                    </RechartsBarChart>
                </ChartContainer>
            </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><PlusCircle className="text-chart-2" /> Income / Turnover</CardTitle>
                    <CardDescription>HMRC Category: Your self-employed turnover.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Source</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {financialData.turnover.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.source}</TableCell>
                                    <TableCell className="text-right">£{item.amount.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><MinusCircle className="text-destructive" /> Allowable Business Expenses</CardTitle>
                    <CardDescription>Costs you can claim to reduce your tax bill.</CardDescription>
                </Header>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>HMRC Category</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {financialData.expenses.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.item}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{item.category}</TableCell>
                                    <TableCell className="text-right">£{item.amount.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
