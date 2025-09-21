"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/zustand/authStore";
import { useApplications } from "@/hooks/useApplications";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Briefcase, Calendar, FileText } from "lucide-react";
import formatDate from "@/lib/formatDate";
import formatCurrency from "@/lib/formatCurrency";
// import { downloadCV } from "@/fetch/applicationFetch";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    SUBMITTED: { label: "Submitted", color: "bg-blue-100 text-blue-700" },
    INTERVIEW: { label: "Interview", color: "bg-purple-100 text-purple-700" },
    ACCEPTED: { label: "Accepted", color: "bg-green-100 text-green-700" },
    REJECTED: { label: "Rejected", color: "bg-red-100 text-red-700" },
  };
  const cfg = map[status] || { label: status, color: "bg-gray-100 text-gray-700" };
  return <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${cfg.color}`}>{cfg.label}</span>;
}

export default function MyApplicationsPage() {
  const router = useRouter();
  const { isLogin, role, checkLogin } = useAuthStore();

  useEffect(() => {
    // Wait until AuthInit finishes keep-login (checkLogin flips to false)
    if (checkLogin) return;

    if (!isLogin) {
      router.push("/auth/login?redirect=/dashboard/my-applications");
      return;
    }
    if (role !== "USER") {
      router.push("/dashboard");
    }
  }, [isLogin, role, checkLogin, router]);

  const { applications, loading, error, page, total, limit, nextPage, prevPage } = useApplications(1, 8);

  const handleViewCv = async (cvUrl?: string) => {
    if (!cvUrl) return;
    try {
      const res = await fetch(cvUrl, { credentials: 'include' as RequestCredentials });
      if (!res.ok) throw new Error('Failed to fetch CV');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
      // cleanup later (let browser manage lifecycle)
      setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
    } catch (e) {
      // Fallback to direct open if blob fetch fails (CORS or non-PDF sources)
      window.open(cvUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Show a lightweight placeholder while verifying session to avoid flicker/early redirect
  if (checkLogin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Checking your session…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => router.back()} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
              <p className="text-gray-600">Track progress of jobs you've applied to</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/3 mt-2" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center">
              <Briefcase className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-700 font-medium">You haven't applied to any jobs yet.</p>
              <p className="text-gray-500 text-sm mt-1">Find your next opportunity in the jobs page.</p>
              <Button className="mt-4" onClick={() => router.push("/jobs")}>Browse Jobs</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map((app) => (
              <Card key={app.application_id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{app.job_title || `Application #${app.application_id}`}</CardTitle>
                      {app.company_name && (
                        <div className="text-sm text-gray-600">{app.company_name}</div>
                      )}
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Applied at {formatDate(app.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <button onClick={() => handleViewCv(app.cv)} className="text-blue-600 hover:underline">
                        View CV
                      </button>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <div className="text-xs text-gray-500">Expected Salary</div>
                        <div className="font-semibold text-gray-900">{formatCurrency(app.expected_salary)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Application Status</div>
                        <div className="mt-1">
                          <StatusBadge status={app.status} />
                        </div>
                      </div>
                    </div>
                    {app.job_slug && (
                      <div className="pt-3">
                        <Link href={`/jobs/${app.job_slug}`} className="text-blue-600 hover:underline text-sm">
                          View job details
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {applications.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Page {page} • {applications.length} of {total} applications
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={prevPage} disabled={page <= 1}>Previous</Button>
              <Button variant="outline" onClick={nextPage} disabled={page * limit >= total}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
