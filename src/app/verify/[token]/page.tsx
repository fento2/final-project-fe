"use client";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/helper/apiCall";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";

const VerifyPage = () => {
    const params = useParams();
    const router = useRouter();
    const onVerify = async () => {
        try {
            console.log(params);
            const verify = await apiCall.get("/auth/verify", {
                headers: {
                    Authorization: `Bearer ${params.token}`,
                }
            });

            alert('Verifikasi berhasil!');
            router.replace('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="min-h-screen grid items-center text-center">
            <div>
                <h3>Click button below to verify your account</h3>
                <Button type="button" onClick={onVerify}>Verify Account</Button>
            </div>
        </div>
    )
}

export default VerifyPage;