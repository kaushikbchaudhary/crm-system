"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, UserPlus } from "lucide-react";
import { useState } from "react";
import { CreateSalesDialog } from "@/components/create-sales-dialog";
import { SalesList } from "@/components/sales-list";
import { Header } from "@/components/header";
import { SalesUser } from "@/app/types";

export default function AdminDashboard() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [salesUsers, setSalesUsers] = useState<SalesUser[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "sales",
      region: "North",
      totalDeals: 45,
      activeDeals: 12,
      createdAt: "2024-03-20",
    },
  ]);

  const adminUser = {
    name: "Admin User",
    email: "admin@example.com",
    role: "admin"
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header user={adminUser} />
      <main className="flex-1">
        <div className="container mx-auto p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Dashboard Overview</h2>
            <Button onClick={() => setShowCreateDialog(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Create Sales User
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Sales Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{salesUsers.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {salesUsers.reduce((acc, user) => acc + user.activeDeals, 0)}
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {salesUsers.reduce((acc, user) => acc + user.totalDeals, 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="overflow-hidden">
            <SalesList salesUsers={salesUsers} />
          </div>

          <CreateSalesDialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
            onCreateSales={(newUser) => {
              setSalesUsers([...salesUsers, { ...newUser, id: String(salesUsers.length + 1) }]);
              setShowCreateDialog(false);
            }}
          />
        </div>
      </main>
    </div>
  );
}