"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Footer from "./footer";

export default function ConditionalFooter() {
  const pathname = usePathname() || "/";

  const hideOn = ["/signin", "/signup", "/dashboard"];

  const shouldHide = hideOn.some((p) => pathname.startsWith(p));

  if (shouldHide) return null;
  return <Footer />;
}
