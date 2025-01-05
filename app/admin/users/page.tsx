"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { UserTable } from "@/components/users/user-table";
import { UserForm } from "@/components/users/user-form";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { SalesUser } from "@/app/types";

export default function UsersPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [users, setUsers] = useState<SalesUser[]>([
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

  const handleCreateUser = (newUser: SalesUser) => {
    setUsers([...users, { ...newUser, id: String(users.length + 1) }]);
    setShowCreateForm(false);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleUpdateUser = (updatedUser: SalesUser) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header user={adminUser} />
      <main className="flex-1">
        <div className="container mx-auto p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">User Management</h2>
            <Button onClick={() => setShowCreateForm(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </div>

          <UserTable 
            users={users}
            onDelete={handleDeleteUser}
            onUpdate={handleUpdateUser}
          />

          <UserForm
            open={showCreateForm}
            onOpenChange={setShowCreateForm}
            onSubmit={handleCreateUser}
          />
        </div>
      </main>
    </div>
  );
}