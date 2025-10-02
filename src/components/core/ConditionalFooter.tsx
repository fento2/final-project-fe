"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname() || "/";

  const shouldHide = pathname.includes("/dashboard/") || pathname.startsWith('/verify') || pathname.startsWith('/selection');

  if (shouldHide) return null;
  return <Footer />;
}
