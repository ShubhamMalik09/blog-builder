"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";
import TagInitializer from "@/components/TagInitialiser";
import { Toaster } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {isLoginPage ? (children) : (
            <ProtectedRoute>
              <TagInitializer />
              {children}
            </ProtectedRoute>
          )}
          <Toaster  position="top-center" richColors/>
        </Providers>
      </body>
    </html>
  );
}
