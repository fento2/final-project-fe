"use client";

import { useEffect } from "react";
import { apiCall } from "@/helper/apiCall";
import { useAuthStore } from "@/lib/zustand/authStore";

// Initializes auth state globally by running keep-login once per app load.
// Ensures checkLogin flips to false on all routes (including /dashboard),
// so pages relying on authStore won't hang waiting forever.
export default function AuthInit() {
    const { setIsLogin, setChekLogin, setLogOut, setAuth, checkLogin } = useAuthStore();

    useEffect(() => {
        // Only run while we're still checking login to avoid duplicate requests
        if (!checkLogin) return;

        const keepLogin = async () => {
            try {
                const { data } = await apiCall.get("/auth/keep-login");
                if (data?.success) {
                    setIsLogin(true);
                    setAuth(data.data.email, data.data.role, data.data.profile_picture, data.data.username);
                } else {
                    setLogOut();
                }
            } catch (error) {
                setLogOut();
                console.log("keep-login error", error);
            } finally {
                setChekLogin(false);
            }
        };

        keepLogin();
    }, [checkLogin, setIsLogin, setChekLogin, setLogOut, setAuth]);

    return null;
}
