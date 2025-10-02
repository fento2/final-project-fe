"use client";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/core/Navbar";
import { useAuthStore } from "@/lib/zustand/authStore";
import { apiCall } from "@/helper/apiCall";


export default function ConditionalNavbar() {
  const { setIsLogin, setChekLogin, setLogOut, setAuth } = useAuthStore()


  const keepLogin = async () => {
    try {
      const { data } = await apiCall.get("/auth/keep-login")
      if (data.success) {
        setIsLogin(true)
        setAuth(data.data.email, data.data.role.toUpperCase(), data.data.profile_picture, data.data.username)

      }
    } catch (error) {
      setLogOut()
    } finally {
      setChekLogin(false)
    }
  }



  useEffect(() => {
    keepLogin()
  }, [])

  const pathname = usePathname() || "/";

  const shouldHide = pathname.includes("/dashboard/") || pathname.startsWith("/verify");
  if (shouldHide) return null;
  return <Navbar />;
}
