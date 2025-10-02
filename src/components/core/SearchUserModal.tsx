"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { apiCall } from "@/helper/apiCall";
import { MapPin, Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { generateCompanySlug } from "@/helper/companySlugHelper";

type PublicProfile = {
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  profile_picture?: string;
  address?: string;
  role?: string;
  slug?: string;
};

interface SearchUserModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  username: string;
}

const toAbsolute = (url?: string) => {
  if (!url) return "/images/logo.png";
  if (/^https?:\/\//i.test(url)) return url;
  const beBase = process.env.NEXT_PUBLIC_URL_BE || "";
  return beBase ? `${beBase}${url.startsWith("/") ? "" : "/"}${url}` : url;
};

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
  // Check role first
  const role = user?.role?.toString?.()?.toUpperCase?.();
  if (role === "COMPANY" || role === "COMPANIES") return true;
  
  // Fallback: check username pattern
  const username = user?.username?.toString?.()?.toLowerCase?.();
  if (username?.includes("_company") || username?.endsWith("company")) return true;
  
  return false;
};

export default function SearchUserModal({ open, onOpenChange, username }: SearchUserModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [results, setResults] = useState<PublicProfile[]>([]);

  useEffect(() => {
    if (!open || !username) return;
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        setProfile(null);
        setResults([]);

        // 1) Try broader search by username or name using public users endpoint
        let list: PublicProfile[] = [];
        try {
          const resList = await apiCall.get(`/public/users`, { params: { search: username } });
          const raw = (resList as any)?.data?.data ?? (resList as any)?.data;
          if (Array.isArray(raw)) {
            // Map and ensure address field is properly handled
            list = raw.map((item: any) => ({
              name: item.name || null,
              username: item.username || null,
              email: item.email || null,
              phone: item.phone || null,
              profile_picture: item.profile_picture || null,
              address: item.address || null, // Ensure address is mapped
              role: item.role || null,
              slug: item.slug || null,
            }));
          }
          console.log('Public users API response:', raw);
          console.log('Mapped search results:', list);
        } catch {
          // ignore search errors, fallback to exact profile
        }

        if (cancelled) return;

        if (list.length > 0) {
          // Filter out developers from search results
          const filteredList = list.filter((u: any) => 
            u?.role?.toString?.()?.toUpperCase?.() !== 'DEVELOPER'
          );
          
          setResults(filteredList);
          const exact = filteredList.find((u: any) => u?.username?.toLowerCase?.() === username.toLowerCase());
          if (exact) setProfile(exact);
        } else {
          // 2) Fallback: exact username profile
          const res = await apiCall.get(`/public/profile/${encodeURIComponent(username)}`);
          const rawData = (res as any)?.data?.data ?? (res as any)?.data ?? null;
          
          if (!rawData) {
            setError("User not found");
          } else if (rawData.role?.toString?.()?.toUpperCase?.() === 'DEVELOPER') {
            // Hide developer profiles
            setError("Profile not available");
          } else {
            // Map the profile data properly
            const data: PublicProfile = {
              name: rawData.name || null,
              username: rawData.username || null,
              email: rawData.email || null,
              phone: rawData.phone || null,
              profile_picture: rawData.profile_picture || null,
              address: rawData.address || null, // Ensure address is mapped
              role: rawData.role || null,
              slug: rawData.slug || null,
            };
            console.log('Exact profile API response:', rawData);
            console.log('Mapped exact profile data:', data);
            setProfile(data);
            setResults([data]);
          }
        }

        // Save to local history for suggestions
        try {
          const rawH = typeof window !== "undefined" ? window.localStorage.getItem("user-search-history") : null;
          const history: string[] = rawH ? JSON.parse(rawH) : [];
          const uname = (list[0]?.username || profile?.username || username) as string;
          if (uname && !history.includes(uname)) {
            const next = [uname, ...history].slice(0, 10);
            window.localStorage.setItem("user-search-history", JSON.stringify(next));
          }
        } catch {}
      } catch (e: any) {
        if (!cancelled) {
          const msg = e?.response?.data?.message || e?.message || "Failed to search user";
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [open, username]);

  const location = useMemo(() => {
    const addr = profile?.address;
    return addr && addr.trim() ? addr : null;
  }, [profile]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Search Result</DialogTitle>
          <DialogDescription>
            Showing matches for: <span className="font-medium">{username}</span>
          </DialogDescription>
        </DialogHeader>

        {loading && <div className="py-8 text-center text-gray-500">Loading…</div>}

        {!loading && error && (
          <div className="py-6 text-center">
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        )}

        {!loading && !error && profile && (
          <div className="flex items-start gap-4">
            <Image
              src={toAbsolute(profile.profile_picture)}
              alt="avatar"
              width={64}
              height={64}
              className="rounded-full object-cover ring-2 ring-white shadow"
            />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 truncate">{profile.name || profile.username || "User"}</div>
              <div className="text-sm text-gray-600 truncate">@{profile.username}</div>
              <div className="mt-2 flex flex-col gap-1 text-sm text-gray-700">
                {location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{location}</span>
                  </div>
                )}
                {profile.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{profile.email}</span>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    if (isCompanyUser(profile)) {
                      const slug = buildCompanySlug(profile.name, profile.username, profile.slug);
                      return router.push(`/jobs/companies/${slug}`);
                    }
                    return router.push(`/profile/${encodeURIComponent(profile.username || username)}`);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                >
                  View full profile
                </button>
                <button onClick={() => onOpenChange(false)} className="px-4 py-2 border rounded-md text-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && results.length > 1 && (
          <div className="mt-6 border-t pt-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Other matches</div>
            <div className="max-h-72 overflow-y-auto divide-y">
              {results.map((u, idx) => (
                <button
                  key={`${u.username}-${idx}`}
                  className="w-full flex items-center gap-3 py-2 hover:bg-gray-50 text-left px-1"
                  onClick={() => {
                    if (isCompanyUser(u)) {
                      const slug = buildCompanySlug(u?.name, u?.username, (u as any)?.slug);
                      return router.push(`/jobs/companies/${slug}`);
                    }
                    return router.push(`/profile/${encodeURIComponent(u.username || "")}`);
                  }}
                >
                  <Image src={toAbsolute(u.profile_picture)} alt="avatar" width={28} height={28} className="rounded-full object-cover" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{u.name || u.username}</span>
                    <span className="text-xs text-gray-600">@{u.username}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
