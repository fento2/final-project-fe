// export const authRole = (validRole: string, userRole: string) => {
//   if (validRole !== userRole) {
//     return false;
//   } else {
//     return true;
//   }
// };
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/zustand/authStore";

export const useAuthRole = (validRole: string): void => {
  const { role, checkLogin, isLogin } = useAuthStore((state) => ({
    role: state.role,
    checkLogin: state.checkLogin,
    isLogin: state.isLogin,
  }));

  const router = useRouter();

  useEffect(() => {
    // Kalau sedang cek login, tunggu dulu
    if (checkLogin) return;

    // Redirect kalau user tidak login atau role tidak sesuai
    if (!isLogin || role !== validRole) {
      router.replace("/");
    }
  }, [role, validRole, isLogin, checkLogin, router]);
};
