"use client";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/core/Navbar";
import { useAuthStore } from "@/lib/zustand/authStore";
import { apiCall } from "@/helper/apiCall";

export default function ConditionalNavbar() {
  const { setIsLogin, setChekLogin, setLogOut } = useAuthStore()
  const keepLogin = async () => {
    try {
      const { data } = await apiCall.get("/auth/keep-login", {

      })
      if (data.success) {
        setIsLogin(true)
      } else {
        setIsLogin(false)
      }
    } catch (error) {
      setIsLogin(false)
    } finally {
      setChekLogin(true) // selalu dijalankan, tanda pengecekan selesai
    }
  }


  useEffect(() => {
    keepLogin()
  }, [])
  const pathname = usePathname() || "/";

  const hideOn = ["/dashboard"];

  const shouldHide = hideOn.some((p) => pathname.startsWith(p));

  if (shouldHide) return null;
  return <Navbar />;
}
