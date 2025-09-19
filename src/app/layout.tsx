import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ShowSideBar from "./dashboard/components/ShowSideBar";
import ConditionalNavbar from "@/components/core/ConditionalNavbar";
import ConditionalFooter from "@/components/core/ConditionalFooter";
import { ToastProvider } from "@/components/basic-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthInit from "@/components/core/AuthInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Horizon Jobs",
  description: "Find your dream job with Horizon Jobs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          {/* Ensure auth store is initialized globally on all routes */}
          <AuthInit />
          <ShowSideBar />
          <ConditionalNavbar />
          <ToastProvider />

          {children}
          <ConditionalFooter />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
