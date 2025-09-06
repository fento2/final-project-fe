"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { KeyRoundIcon, Mail, Truck } from "lucide-react";
import { Dots_v2 } from "@/components/ui/spinner";
import { apiCall } from "@/helper/apiCall";
import { schemaForgetPassword } from "@/validation/auth.validation";
import CheckEmail from "./components/ModalCheckEmail";

const ForgetPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [show, setShow] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setError('')
            setLoading(true)
            const result = schemaForgetPassword.safeParse({ email })
            if (!result.success) {
                const messages = result.error.issues[0].message;
                return setError(messages);
            }
            const { data } = await apiCall.post('/auth/forget-password', { email })
            if (data.success) {
                setShow(true)
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center  px-4">
            {loading && <div className="absolute z-50 flex justify-center h-screen w-full">
                <Dots_v2 />

            </div>
            }
            {show && <CheckEmail />}
            {!show && <Card className="w-full max-w-md shadow-xl rounded-2xl">
                <CardHeader className="space-y-3 text-center">
                    {/* Logo / Icon */}
                    <div className="flex justify-center">
                        <KeyRoundIcon className="w-12 h-12 text-indigo-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        Forgot Password
                    </CardTitle>
                    <CardDescription>
                        Enter your email and we’ll send you a secure link to reset your
                        password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col space-y-2 text-left">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="!text-lg py-6"

                            />
                            <span className="text-red-500 text-sm">{error}</span>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 text-lg"
                        >
                            Send Reset Link
                        </Button>
                    </form>
                </CardContent>
            </Card>}
        </div>
    );
};

export default ForgetPasswordPage;
