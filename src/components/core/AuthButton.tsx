"use client";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/lib/zustand/authStore";
import { useAuthUIStore } from "@/lib/zustand/authUIASrore";
import { apiCall } from "@/helper/apiCall";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut, UserCircle2 } from "lucide-react";
import { toTitleCase } from "@/helper/toTitleCase";

export default function AuthButtons() {
    const { setShowSignIn, setShowSignUp } = useAuthUIStore()
    const { isLogin, checkLogin, setLogOut, email, role } = useAuthStore()
    const router = useRouter()

    const handleLogOut = async () => {
        try {
            const { data } = await apiCall.get('/auth/logout')
            if (data.success) {
                setLogOut()
            }
        } catch (error) {
            console.log(error)
        }
    }

    if (isLogin) {
        return (
            <DropdownMenu>
                <div className="border-r border-neutral-400 border h-10 mr-2" />
                <DropdownMenuTrigger asChild>
                    <div className="flex items-center cursor-pointer">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src="https://originui.com/avatar-80-07.jpg" alt="User" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-w-70">
                    {/* Avatar + Email */}
                    <div className="flex items-center gap-3 px-2 py-3">
                        <Avatar className="w-12 h-12 rounded-full shadow">
                            <AvatarImage src="https://originui.com/avatar-80-07.jpg" alt="User" />
                            <AvatarFallback>
                                <UserCircle2 className="w-6 h-6 text-gray-400" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col ">
                            <span className="truncate font-semibold text-gray-900 dark:text-white max-w-48">
                                {email}
                            </span>
                            <span className="truncate text-sm text-gray-500 dark:text-gray-400">
                                {toTitleCase(role)}
                            </span>
                        </div>
                    </div>
                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2" />

                    {/* Menu Items */}

                    <DropdownMenuItem
                        onClick={() => router.push("/dashboard")}
                        className="text-lg"
                    >
                        Dashboard
                    </DropdownMenuItem>
                    {/* Separator */}
                    <DropdownMenuSeparator />
                    {/* Logout */}
                    <DropdownMenuItem
                        onClick={handleLogOut}
                        className="text-lg flex items-center gap-2 text-red-500 py-2"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

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
