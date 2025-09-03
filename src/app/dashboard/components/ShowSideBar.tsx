"use client";

import { usePathname, useRouter } from "next/navigation";
import { SideBar } from "./SideBar";
import { useAuthStore } from "@/lib/zustand/authStore";
import { useEffect } from "react";

const ShowSideBar = () => {
  const pathname = usePathname();
  const hideOn = ["/dashboard"];
  const { isLogin, checkLogin } = useAuthStore()
  const router = useRouter()

  const shouldHide = hideOn.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (shouldHide && checkLogin && !isLogin) {
      router.replace('/')
    }
  }, [shouldHide, isLogin, checkLogin]);



  if (shouldHide) return < SideBar />



  return null;
};
export default ShowSideBar;
