"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname() || "/";

  const hideOn = ["/dashboard", '/verify'];

  const shouldHide = hideOn.some((p) => pathname.startsWith(p));

  if (shouldHide) return null;
  return <Footer />;
}
