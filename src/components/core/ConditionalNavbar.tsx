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
        setAuth(data.email || data.data.email, data.role || data.data.role)
        console.log(data)
      }
    } catch (error) {
      setLogOut()
      console.log(error)
    } finally {
      setChekLogin(false)
    }
  }



  useEffect(() => {
    keepLogin()
  }, [])

  const pathname = usePathname() || "/";

  const hideOn = ["/dashboard", "/verify"];

  const shouldHide = hideOn.some((p) => pathname.startsWith(p));

  if (shouldHide) return null;
  return <Navbar />;
}
