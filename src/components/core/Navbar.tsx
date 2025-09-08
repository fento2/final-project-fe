"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButtons from "./AuthButton";
import MobileNav from "./MobileNav";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import { useAuthUIStore } from "@/lib/zustand/authUIASrore";

const menus = [
  { label: "Home", href: "/" },
  { label: "Jobs", href: "/jobs" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { showSignIn, showSignUp } = useAuthUIStore();
  const [open, setOpen] = useState(false);
  const findActiveMenu = (pathname: string) => {
    const matched = menus.filter((m) => pathname.startsWith(m.href));

    if (matched.length === 0) return "Home";


    return matched.reduce((prev, curr) =>
      curr.href.length > prev.href.length ? curr : prev
    ).label;
  };

  const [active, setActive] = useState(findActiveMenu(pathname));

  useEffect(() => {
    setActive(findActiveMenu(pathname));
  }, [pathname]);


  return (
    <nav className="w-full bg-white py-6 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" onClick={() => setActive("Home")}>
          <img src="/images/logo.png" alt="logo" className="w-36" />
        </Link>

        {/* Desktop menu */}
        <ul className="hidden lg:flex gap-8 items-center text-sm font-medium text-gray-600">
          {menus.map((m) => (
            <li key={m.label}>
              <Link
                href={m.href}
                onClick={() => setActive(m.label)}
                className={`relative px-2 py-1 transition-colors duration-200 ${active === m.label
                  ? "text-[#4F46E5] after:absolute after:left-0 after:bottom-0 after:w-full after:h-1 after:bg-[#4F46E5] after:rounded-full"
                  : "text-gray-600 hover:text-[#4F46E5] hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:w-full hover:after:h-1 hover:after:bg-[#4F46E5] hover:after:rounded-full"
                  }`}
              >
                {m.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <div className="lg:flex items-center gap-2 hidden">
            <AuthButtons />
          </div>

          {/* Mobile toggle */}
          {!open && <button
            className="lg:hidden p-2 rounded-md border"
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
                d={"M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>}
        </div>

        {/* Mobile menu */}
        {open && <MobileNav setOpen={setOpen} setActive={setActive} active={active} />}
      </div>

      {/* Modals */}
      {showSignIn && <SignIn />}
      {showSignUp && <SignUp />}
    </nav>
  );
};

export default Navbar;
