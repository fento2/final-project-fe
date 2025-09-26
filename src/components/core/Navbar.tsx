"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AuthButtons from "./AuthButton";
import MobileNav from "./MobileNav";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import SearchUserModal from "@/components/core/SearchUserModal";
import { useUserSearchSuggestions } from "@/hooks/useUserSearchSuggestions";
import Image from "next/image";
import { generateCompanySlug } from "@/helper/companySlugHelper";
import { useAuthUIStore } from "@/lib/zustand/uiAuthSrore";

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
  const router = useRouter();
  const { showSignIn, showSignUp } = useAuthUIStore();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);
  const suggestRef = useRef<HTMLDivElement>(null);
  const { suggestions } = useUserSearchSuggestions(query);
  const buildCompanySlug = (name?: string, username?: string, slug?: string) => {
    if (slug && slug.trim()) return slug;
    // Prefer company name if provided from API
    if (name && name.trim()) return generateCompanySlug(name);
    // Best-effort: derive from username by stripping common suffix and normalizing
    if (username) {
      const base = username
        .replace(/[_-]?company$/i, "") // remove trailing "company"
        .replace(/[_-]+/g, " "); // treat underscores/hyphens as spaces
      return generateCompanySlug(base);
    }
    return "";
  };

  const isCompanyUser = (user: any): boolean => {
    // Check role first
    const role = user?.role?.toString?.()?.toUpperCase?.();
    if (role === "COMPANY" || role === "COMPANIES") return true;

    // Fallback: check username pattern
    const username = user?.username?.toString?.()?.toLowerCase?.();
    if (username?.includes("_company") || username?.endsWith("company")) return true;

    return false;
  };
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

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target as Node)) {
        setShowSuggest(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);


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
          {/* Desktop search bar */}
          <form
            className="hidden lg:flex items-center mr-3"
            onSubmit={(e) => {
              e.preventDefault();
              const q = query.trim();
              if (!q) return;
              setSubmittedQuery(q);
              setShowModal(true);
              setShowSuggest(false);
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
                  className="px-3 py-2 w-56 text-sm outline-none"
                  aria-label="Search user"
                />
                <button
                  type="submit"
                  className="px-2 py-2 text-sm bg-indigo-600 text-white hover:bg-indigo-700"
                  aria-label="Search"
                >
                  Search
                </button>
              </div>

              {/* Suggestions dropdown */}
              {showSuggest && query.trim().length >= 2 && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 w-72">
                  {suggestions.map((s, i) => (
                    <button
                      type="button"
                      key={`${s.username}-${i}`}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-left"
                      onClick={() => {
                        setShowSuggest(false);
                        // If suggestion is a company, go to company detail by slug
                        if (isCompanyUser(s)) {
                          const slug = buildCompanySlug(s.name, s.username, s.slug);
                          return router.push(`/jobs/companies/${slug}`);
                        }
                        // Otherwise, open user modal
                        setQuery(s.username);
                        setSubmittedQuery(s.username);
                        setShowModal(true);
                      }}
                    >
                      <Image src={s.profile_picture || "/images/logo.png"} alt="avatar" width={24} height={24} className="rounded-full object-cover" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">@{s.username}</span>
                        <span className="text-xs text-gray-600">{s.name || (s.role ? s.role : "")}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </form>

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
      <SearchUserModal open={showModal} onOpenChange={setShowModal} username={submittedQuery} />
    </nav>
  );
};

export default Navbar;
