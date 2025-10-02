"use client";
import { Button } from "@/components/ui/button";
import { Dots_v2 } from "@/components/ui/spinner";
import { apiCall } from "@/helper/apiCall";
import { ShieldCheck } from "lucide-react";
import { useParams } from "next/navigation";
import * as React from "react";
import ModalVerify from "./components/ModalVerify";

const VerifyPage = () => {
    const params = useParams();
    const [loading, setLoading] = React.useState(false)
    const [openModal, setOpenModal] = React.useState(false)
    const onVerify = async () => {
        try {
            setLoading(true)
            const { data } = await apiCall.get("/auth/verify", {
                headers: {
                    Authorization: `Bearer ${params.token}`,
                }
            });
            if (data.success) {
                setOpenModal(true)
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            {loading && <div className="absolute z-50 flex justify-center h-screen w-full">
                <Dots_v2 />

            </div>}
            <ModalVerify open={openModal} setOpen={setOpenModal} />
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-full bg-indigo-100 dark:bg-indigo-900">
                        <ShieldCheck className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    Verify Your Account
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Click the button below to verify your email and activate your account.
                </p>

                {/* Button */}
                <Button
                    type="button"
                    onClick={onVerify}
                    className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                >
                    Verify Account
                </Button>
            </div>
        </div>
    )
}

export default VerifyPage;