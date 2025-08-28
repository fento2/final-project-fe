"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
    const pathname = usePathname() || "/";

    const hideOn = ["/signin", "/signup"];

    const shouldHide = hideOn.some((p) => pathname.startsWith(p));

    if (shouldHide) return null;
    return <Navbar />;
}