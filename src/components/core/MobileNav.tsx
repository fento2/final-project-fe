"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { LogOut, UserCircle2 } from "lucide-react";
import { useAuthStore } from "@/lib/zustand/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toTitleCase } from "@/helper/toTitleCase";
import { motion, AnimatePresence } from "framer-motion";
import { handleLogOut } from "@/helper/handleLogout";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserSearchSuggestions } from "@/hooks/useUserSearchSuggestions";
import { generateCompanySlug } from "@/helper/companySlugHelper";
import Image from "next/image";
import { useAuthUIStore } from "@/lib/zustand/uiAuthSrore";
import { MobileCompanyOption, MobileDeveloperOption, MobileUserOption } from "./OptionSection";

interface IMobileNav {
  setOpen: (open: boolean) => void;
  setActive: (active: string) => void;
  active: string;
}

const MobileNav = ({ setOpen, setActive, active }: IMobileNav) => {
  const { setShowSignIn, setShowSignUp } = useAuthUIStore();
  const { isLogin, setLogOut, email, role, profile_picture } = useAuthStore();
  const router = useRouter();

  // Search state
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);
  const suggestRef = useRef<HTMLDivElement>(null);
  const { suggestions } = useUserSearchSuggestions(query);

  const buildCompanySlug = (name?: string, username?: string, slug?: string) => {
    if (slug && slug.trim()) return slug;
    if (name && name.trim()) return generateCompanySlug(name);
    if (username) {
      const base = username
        .replace(/[_-]?company$/i, "")
        .replace(/[_-]+/g, " ");
      return generateCompanySlug(base);
    }
    return "";
  };

  const isCompanyUser = (user: any): boolean => {
    const role = user?.role?.toString?.()?.toUpperCase?.();
    if (role === "COMPANY" || role === "COMPANIES") return true;
    const username = user?.username?.toString?.()?.toLowerCase?.();
    if (username?.includes("_company") || username?.endsWith("company")) return true;
    return false;
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target as Node)) {
        setShowSuggest(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

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
          className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white shadow-lg flex flex-col pt-6 px-6 overflow-y-auto"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src="/images/logo.png" alt="logo" className="w-32 h-auto" />
          </div>

          {/* Mobile Search Bar */}
          <div className="mb-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = query.trim();
                if (!q) return;
                setSubmittedQuery(q);
                setShowModal(true);
                setShowSuggest(false);
                setOpen(false); // Close mobile menu
              }}
            >
              <div className="relative" ref={suggestRef}>
                <div className="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShowSuggest(true);
                    }}
                    onFocus={() => setShowSuggest(true)}
                    placeholder="Search user by username..."
                    className="px-3 py-2 flex-1 text-sm outline-none"
                    aria-label="Search user"
                  />
                  <button
                    type="submit"
                    className=" px-4 py-2 text-sm bg-indigo-600 text-white hover:bg-indigo-700"
                    aria-label="Search"
                  >
                    Src
                  </button>
                </div>

                {/* Mobile Suggestions dropdown */}
                {showSuggest && query.trim().length >= 2 && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                    {suggestions.map((s, i) => (
                      <button
                        type="button"
                        key={`${s.username}-${i}`}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-left"
                        onClick={() => {
                          setShowSuggest(false);
                          setOpen(false); // Close mobile menu
                          if (isCompanyUser(s)) {
                            const slug = buildCompanySlug(s.name, s.username, s.slug);
                            return router.push(`/jobs/companies/${slug}`);
                          }
                          setQuery(s.username);
                          setSubmittedQuery(s.username);
                          setShowModal(true);
                        }}
                      >
                        <Image src={s.profile_picture || "/images/logo.png"} alt="avatar" width={24} height={24} className="rounded-full object-cover" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium text-gray-900 truncate">@{s.username}</span>
                          <span className="text-xs text-gray-600 truncate">{s.name || (s.role ? s.role : "")}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </form>
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
                  <span className="truncate text-sm font-medium text-gray-900">
                    {email}
                  </span>
                  <span className="truncate text-xs text-gray-500">
                    {toTitleCase(role)}
                  </span>
                </div>
              </div>

              {/* Submenu */}
              <ul className="pl-4 flex flex-col gap-2 mt-1">
                {role === 'DEVELOPER' && <MobileDeveloperOption setOpen={setOpen} />}
                {role === 'COMPANY' && <MobileCompanyOption setOpen={setOpen} />}
                {role === 'USER' && < MobileUserOption setOpen={setOpen} />}

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
