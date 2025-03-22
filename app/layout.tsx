'use client';
export const dynamic = 'force-dynamic';

import './globals.css';
import ClientNavbarWrapper from '../components/ClientNavbarWrapper';
import { Raleway } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";

const raleway = Raleway({
  subsets: ['latin'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={raleway.className}>
        <ClientNavbarWrapper />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
