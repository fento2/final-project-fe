"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import MobileNav from "./MobileNav";
import { useAuthStore } from "@/lib/zustand/AuthUI";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { showSignIn, showSignUp, setShowSignIn, setShowSignUp } =
    useAuthStore();
  const menus = [
    { label: "Home", href: "/" },
    { label: "Jobs", href: "/jobs" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];
  const [active, setActive] = useState<string>(
    () => menus.find((m) => m.href === pathname)?.label ?? "Home"
  );
  const [open, setOpen] = useState<boolean>(false);
  const navRef = useRef<HTMLUListElement | null>(null);
  const menuRefs = useRef<Record<string, HTMLElement | null>>({});
  const [underlineStyle, setUnderlineStyle] = useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });

  const updateUnderline = (key = active) => {
    const el = menuRefs.current[key];
    const parent = navRef.current;
    if (!el || !parent) return;
    const elRect = el.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    setUnderlineStyle({
      left: elRect.left - parentRect.left,
      width: elRect.width,
    });
  };

  useEffect(() => {
    setActive(menus.find((m) => m.href === pathname)?.label ?? "Home");
    updateUnderline();
    const onResize = () => updateUnderline();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <nav className="w-full bg-white py-6 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            onClick={() => {
              setActive("Home");
              setOpen(false);
            }}
          >
            <img src="/images/logo.png" alt="logo" className="w-36 h-auto" />
          </Link>
        </div>

        {/* Desktop menu */}
        <ul
          ref={navRef}
          className="hidden md:flex gap-8 items-center text-sm font-medium text-gray-600 relative"
        >
          {menus.map((m) => (
            <li key={m.label} className="pb-4 text-[#111827]">
              <Link
                href={m.href}
                ref={(el) => {
                  menuRefs.current[m.label] = el;
                  return undefined;
                }}
                onClick={() => setActive(m.label)}
                className={`px-2 ${
                  active === m.label ? "text-[#111827]" : "hover:text-[#111827]"
                }`}
                aria-current={active === m.label ? "page" : undefined}
              >
                {m.label}
              </Link>
            </li>
          ))}

          {/* moving underline */}
          <span
            aria-hidden
            style={{
              left: underlineStyle.left,
              width: underlineStyle.width,
            }}
            className="absolute bottom-0 h-1 bg-[#4F46E5] rounded-full transition-left transition-all duration-300 ease-out"
          />
        </ul>

        {/* Right side buttons */}
        <div className="flex items-center gap-2">
          <Button
            className="hidden md:inline-block px-5 py-2 border border-[#4F46E5] rounded-lg font-medium bg-indigo-600 text-white hover:bg-[#4F46E5] transition"
            onClick={() => setShowSignIn(true)}
          >
            Sign In
          </Button>

          <span className="hidden md:inline-block w-px h-6 bg-gray-300" />
          <Button
            className="hidden md:inline-block px-5 py-2 border border-[#4F46E5] rounded-lg font-medium bg-transparant text-indigo-600 hover:text-white hover:bg-[#4F46E5] transition"
            onClick={() => setShowSignUp(true)}
          >
            Sign Up
          </Button>

          {/* Mobile toggle button */}
          <button
            className="md:hidden p-2 rounded-md border"
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <>
            <MobileNav
              setOpen={setOpen}
              setActive={setActive}
              active={active}
            />
          </>
        )}
      </div>
      {/* Modals */}
      {showSignIn && <SignIn />}
      {showSignUp && <SignUp />}
    </nav>
  );
};
export default Navbar;
