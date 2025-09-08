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
  const { role } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (role !== validRole) {
      router.replace("/");
    }
  }, [role, validRole, router]);
};
