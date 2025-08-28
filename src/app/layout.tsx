import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "../components/core/navbar";
import Footer from "../components/core/footer";


import ShowSideBar from "./dashboard/components/ShowSideBar";

import ConditionalNavbar from "@/components/core/ConditionalNavbar";


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


        <ShowSideBar />
        <ConditionalNavbar />
        {children}
        
  <Footer />

      </body>
    </html>
  );
}
