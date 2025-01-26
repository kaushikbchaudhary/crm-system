"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SalesUser } from "@/app/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Pagination} from "@/components/ui/pagination";

interface SalesListProps {
  salesUsers: SalesUser[] | any;
}

export function SalesList({ salesUsers }: SalesListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Team</CardTitle>
        <CardDescription>
          Overview of all registered sales users and their performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Active Deals</TableHead>
              <TableHead>Total Deals</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesUsers.length && salesUsers.map((user:any) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.region}</TableCell>
                <TableCell>{user.activeDeals}</TableCell>
                <TableCell>{user.totalDeals}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <Pagination/>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}