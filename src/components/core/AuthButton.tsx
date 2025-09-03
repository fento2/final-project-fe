"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/lib/zustand/authStore";
import { useAuthUIStore } from "@/lib/zustand/authUIASrore";
import { apiCall } from "@/helper/apiCall";
import { useRouter } from "next/navigation";

export default function AuthButtons() {
    const { setShowSignIn, setShowSignUp } = useAuthUIStore()
    const { isLogin, checkLogin, setLogOut } = useAuthStore()
    const router = useRouter()

    const handleLogOut = async () => {
        try {
            const { data } = await apiCall.get('/auth/logout')

            if (data.success) {
                alert(data.message)
                setLogOut()
            }
        } catch (error) {

        }
    }

    if (!isLogin && checkLogin) {
        return (
            <div className="flex items-center gap-3">
                <Button
                    className="hidden md:inline-block px-5 py-2 border border-[#4F46E5] rounded-lg font-medium bg-indigo-600 text-white hover:bg-[#4F46E5] transition"
                    onClick={() => setShowSignIn(true)}
                >
                    Sign In
                </Button>

                <span className="hidden md:inline-block w-px h-6 bg-gray-300" />

                <Button
                    className="hidden md:inline-block px-5 py-2 border border-[#4F46E5] rounded-lg font-medium bg-transparent text-indigo-600 hover:text-white hover:bg-[#4F46E5] transition"
                    onClick={() => setShowSignUp(true)}
                >
                    Sign Up
                </Button>
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-[#4F46E5]">
                    Profile
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => {
                    router.push('/dashboard/profile')
                }}>
                    My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLogOut()}
                >
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
