'use client';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

import {ToastProvider, ToastViewport} from "@/components/ui/toast";
import ApiProvider from "@/infrastructure/api/ApiContext";
import {useState} from "react";

const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'SalesForce CRM',
//   description: 'Manage your sales team and monitor performance',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState(null);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ApiProvider user={user} setUser={setUser}>

          <ToastProvider>
          {children}
            <ToastViewport />
          </ToastProvider>
          </ApiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}