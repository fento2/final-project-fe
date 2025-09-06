"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";

const CheckEmail = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen grid place-items-center px-4">
            <Card className="w-full max-w-lg shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                <CardHeader className="text-center space-y-2">
                    <div className="flex justify-center">
                        <Mail className="w-14 h-14 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                        Check Your Email
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                        We've sent a password reset link to your email.
                        Please check your inbox and follow the instructions to reset your password.
                    </p>
                    <Button
                        className="w-full font-medium bg-indigo-600 hover:bg-indigo-800"
                        onClick={() => router.push("/")}
                    >
                        Got It
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default CheckEmail;
