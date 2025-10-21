"use client";
import { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/zustand/authStore";

export const useAuthRole = (validRole: string) => {
  const { role, checkLogin, isLogin } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (checkLogin) return;

    if (role === "DEVELOPER") return;

    if (!isLogin || role !== validRole) {
      redirect("/");
    }
  }, [role, validRole, isLogin, checkLogin, router]);

  return null;
};
