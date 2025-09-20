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
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut, UserCircle2 } from "lucide-react";
import { toTitleCase } from "@/helper/toTitleCase";
import { motion, AnimatePresence } from "framer-motion";
import { handleLogOut } from "@/helper/handleLogout";
import { apiCall } from "@/helper/apiCall";

export default function AuthButtons() {
    const { setShowSignIn, setShowSignUp } = useAuthUIStore();
    const { isLogin, profile_picture, setLogOut, email, role } = useAuthStore();
    const router = useRouter();

    if (isLogin) {
        return (
            <DropdownMenu>
                <div className="relative">
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center cursor-pointer">
                            <Avatar className="w-10 h-10 shadow-lg">
                                <AvatarImage src={profile_picture} alt="User" />
                                <AvatarFallback>
                                    <UserCircle2 className="text-indigo-500" size={40} />
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </DropdownMenuTrigger>

                    <AnimatePresence>
                        <DropdownMenuContent asChild side="bottom" align="end">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="max-w-xs p-2 shadow-xl bg-white dark:bg-gray-800 rounded-lg"
                            >
                                {/* Avatar + Email */}
                                <div className="flex items-center gap-3 px-4 py-3">
                                    <Avatar className="w-16 h-16 shadow-lg">
                                        <AvatarImage src={profile_picture} alt="User" />
                                        <AvatarFallback>
                                            <UserCircle2 className="text-indigo-500" size={70} />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="truncate font-semibold text-gray-900 dark:text-white max-w-full">
                                            {email}
                                        </span>
                                        <span className="truncate text-sm text-gray-500 dark:text-gray-400">
                                            {toTitleCase(role)}
                                        </span>
                                    </div>
                                </div>

                                <DropdownMenuSeparator className="my-2" />

                                {/* Menu Items dengan hover animasi */}
                                <div className="flex flex-col gap-1">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <DropdownMenuItem
                                            onClick={() => router.push("/dashboard")}
                                            className="text-lg px-4 py-2 rounded-md"
                                        >
                                            Dashboard
                                        </DropdownMenuItem>
                                    </motion.div>

                                    {/* Profile page (USER) */}
                                    {role === 'USER' && (
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <DropdownMenuItem
                                                onClick={async () => {
                                                    try {
                                                        const res = await apiCall.get('/account/get-data/user');
                                                        const u = res?.data?.data ?? res?.data ?? {};
                                                        const username = u?.username || u?.user?.username || '';
                                                        if (username) {
                                                            router.push(`/profile/${encodeURIComponent(username)}`);
                                                        } else {
                                                            router.push('/dashboard/profile');
                                                        }
                                                    } catch {
                                                        router.push('/dashboard/profile');
                                                    }
                                                }}
                                                className="text-lg px-4 py-2 rounded-md"
                                            >
                                                Profile
                                            </DropdownMenuItem>
                                        </motion.div>
                                    )}

                                    <DropdownMenuSeparator className="w-full" />

                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <DropdownMenuItem
                                            onClick={() => handleLogOut(setLogOut)}
                                            className="text-lg flex items-center gap-2 text-red-500 px-4 py-2 rounded-md"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Logout
                                        </DropdownMenuItem>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </DropdownMenuContent>
                    </AnimatePresence>
                </div>
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
