"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/core/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname() || "/";

  const hideOn = ["/dashboard"];

  const shouldHide = hideOn.some((p) => pathname.startsWith(p));

  if (shouldHide) return null;
  return <Navbar />;
}
