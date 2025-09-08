"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useAuthUIStore } from "@/lib/zustand/authUIASrore";
import { LayoutDashboardIcon, LogOut, UserCircle2 } from "lucide-react";
import { useAuthStore } from "@/lib/zustand/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toTitleCase } from "@/helper/toTitleCase";
import { motion, AnimatePresence } from "framer-motion";
import { handleLogOut } from "@/helper/handleLogout";

interface IMobileNav {
  setOpen: (open: boolean) => void;
  setActive: (active: string) => void;
  active: string;
}

const MobileNav = ({ setOpen, setActive, active }: IMobileNav) => {
  const { setShowSignIn, setShowSignUp } = useAuthUIStore();
  const { isLogin, setLogOut, email, role, profile_picture } = useAuthStore();

  const menus = [
    { label: "Home", href: "/" },
    { label: "Jobs", href: "/jobs" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <AnimatePresence>
      <motion.div key="mobile-nav-wrapper" className="relative z-50">
        {/* Overlay */}
        <motion.div
          key="overlay"
          className="fixed inset-0 backdrop-blur-sm bg-black/40"
          onClick={() => setOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Mobile Menu */}
        <motion.div
          key="menu"
          className="fixed top-0 right-0 h-full w-72 bg-white shadow-lg flex flex-col pt-6 px-6"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src="/images/logo.png" alt="logo" className="w-32 h-auto" />
          </div>

          {/* Menu Links */}
          <ul className="flex flex-col gap-4">
            {menus.map((m, idx) => (
              <li key={idx}>
                <Link
                  href={m.href}
                  className={`block px-4 py-2 rounded ${active === m.label
                    ? "text-white bg-[#4F46E5]"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                  onClick={() => {
                    setActive(m.label);
                    setOpen(false);
                  }}
                >
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div className="border-t border-gray-300 my-4" />

          {/* My Account / Auth */}
          {isLogin ? (
            <div className="flex flex-col gap-2">
              {/* Avatar + Email + Role */}
              <div className="flex items-center gap-3 px-4 py-2 rounded text-black cursor-pointer">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={profile_picture} alt="User" />
                  <AvatarFallback>
                    <UserCircle2 size={40} className="text-indigo-500" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {email}
                  </span>
                  <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {toTitleCase(role)}
                  </span>
                </div>
              </div>

              {/* Submenu */}
              <ul className="pl-4 flex flex-col gap-2 mt-1">
                <li>
                  <Link
                    href="/dashboard/profile"
                    className="block px-2 py-1 rounded hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="block px-2 py-1 rounded hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <div className="border-t border-gray-300 mb-4 " />
                <li>
                  <Button
                    className="w-full text-left flex items-center gap-2 text-red-500 hover:text-red-700"
                    variant="outline"
                    onClick={() => {
                      handleLogOut(setLogOut);
                      setOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Button
                className="w-full bg-indigo-600 text-white hover:bg-[#4F46E5]"
                onClick={() => {
                  setOpen(false);
                  setShowSignIn(true);
                }}
              >
                Sign In
              </Button>
              <Button
                className="w-full bg-transparent text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-700"
                onClick={() => {
                  setOpen(false);
                  setShowSignUp(true);
                }}
              >
                Sign Up
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileNav;
