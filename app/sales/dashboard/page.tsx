"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Target, TrendingUp } from "lucide-react";
import { Header } from "@/components/header";

export default function SalesDashboard() {
  const salesUser = {
    name: "John Doe",
    email: "john@example.com",
    role: "sales",
    region: "North",
    activeDeals: 12,
    totalDeals: 45,
    recentDeals: [
      {
        id: 1,
        client: "Acme Corp",
        value: 50000,
        status: "In Progress",
        lastUpdated: "2024-03-20",
      },
      {
        id: 2,
        client: "TechStart Inc",
        value: 75000,
        status: "Negotiation",
        lastUpdated: "2024-03-19",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header user={salesUser} />
      <main className="flex-1">
        <div className="container mx-auto p-4 md:p-6">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">
              Region: {salesUser.region}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{salesUser.activeDeals}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{salesUser.totalDeals}</div>
              </CardContent>
            </Card>
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((salesUser.totalDeals / (salesUser.totalDeals + 10)) * 100)}%
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Recent Deals</CardTitle>
            </CardHeader>
            <CardContent className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesUser.recentDeals.map((deal) => (
                    <TableRow key={deal.id}>
                      <TableCell className="font-medium">{deal.client}</TableCell>
                      <TableCell>${deal.value.toLocaleString()}</TableCell>
                      <TableCell>{deal.status}</TableCell>
                      <TableCell>{new Date(deal.lastUpdated).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}