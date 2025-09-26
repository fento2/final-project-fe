"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthUIStore } from "@/lib/zustand/uiAuthSrore";

interface ModalVerifyProps {
    open: boolean
    setOpen: (val: boolean) => void
}

const ModalVerify = ({ open, setOpen }: ModalVerifyProps) => {
    const router = useRouter()
    const { setShowSignIn } = useAuthUIStore()
    return (
        <>

            {/* Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="flex flex-col items-center text-center space-y-2">
                        <CheckCircle2 className="w-12 h-12 text-indigo-600" />
                        <DialogTitle className="text-xl font-semibold">
                            Account Verified
                        </DialogTitle>
                        <DialogDescription>
                            Your email has been successfully verified. <br />
                            You can now access all features of your account.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-center">
                        <Button onClick={() => {
                            setOpen(false)
                            router.replace('/')
                            setShowSignIn(true)

                        }}>Continue</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ModalVerify;
