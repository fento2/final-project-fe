"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Dots_v2 } from "@/components/ui/spinner";
import { useState } from "react";
import ModalSuccess from "../components/ModalSucces";
import { schemaResetPassword } from "@/validation/auth.validation";
import { apiCall } from "@/helper/apiCall";
import { useParams } from "next/navigation";

const ResetPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [dataResetPass, setDataResetPass] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const params = useParams()
    const onBtReset = async () => {
        try {
            setError('');
            setLoading(true);
            const result = schemaResetPassword.safeParse(dataResetPass);
            if (!result.success) {
                const messages = result.error.issues[0].message;
                return setError(messages);
            }
            const payload = {
                newPassword: dataResetPass.newPassword
            }
            const { data } = await apiCall.post(
                "/auth/reset-password",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${params.token}`,
                    },
                }
            );
            if (data.success) {
                setOpen(true);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid place-items-center px-4">
            {loading && (
                <div className="absolute z-50 flex justify-center h-screen w-full">
                    <Dots_v2 />
                </div>
            )}
            <ModalSuccess open={open} setOpen={setOpen} />
            <Card className="w-full max-w-md shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                <CardHeader className="text-center space-y-2">
                    <div className="flex justify-center">
                        <Lock className="w-14 h-14 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                        Reset Password
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* New Password */}
                    <div className="space-y-2 relative">
                        <Label htmlFor="newPassword" className="text-lg">New Password</Label>
                        <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            className="!text-lg py-6 pr-12"
                            value={dataResetPass.newPassword}
                            onChange={(e) =>
                                setDataResetPass({ ...dataResetPass, newPassword: e.target.value })
                            }
                        />
                        <div
                            className="absolute right-3 top-12 cursor-pointer"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <EyeOff /> : <Eye />}
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2 relative">
                        <Label htmlFor="confirmPassword" className="text-lg">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Re-enter new password"
                            className="!text-lg py-6 pr-12"
                            value={dataResetPass.confirmPassword}
                            onChange={(e) =>
                                setDataResetPass({ ...dataResetPass, confirmPassword: e.target.value })
                            }
                        />
                        <div
                            className="absolute right-3 top-12 cursor-pointer"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </div>
                    </div>

                    <span className="text-red-500">{error}</span>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full font-medium py-6 text-lg bg-indigo-500 hover:bg-indigo-800"
                        onClick={onBtReset}
                    >
                        Reset Password
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ResetPasswordPage;
