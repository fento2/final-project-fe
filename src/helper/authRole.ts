// export const authRole = (validRole: string, userRole: string) => {
//   if (validRole !== userRole) {
//     return false;
//   } else {
//     return true;
//   }
// };

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/zustand/authStore";

export const useAuthRole = (validRole: string) => {
  const { role, checkLogin, isLogin } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (checkLogin) return;

    if (!isLogin || role !== validRole) {
      router.replace("/");
    }
  }, [role, validRole, isLogin, checkLogin, router]);
};
