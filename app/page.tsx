"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-8">
            <Building2 className="h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Welcome to SalesForce CRM
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Streamline your sales operations and boost team productivity with our comprehensive CRM solution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <Link href="/admin/login" className="w-full">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Admin Portal</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Manage sales team and monitor performance
                  </p>
                  <Button className="mt-4 w-full">Login as Admin</Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/sales/login" className="w-full">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Sales Portal</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Access your sales dashboard and manage deals
                  </p>
                  <Button className="mt-4 w-full">Login as Sales</Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}