export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'sales';
  createdAt: string;
}

export interface SalesUser extends User {
  totalDeals: number;
  activeDeals: number;
  region: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}