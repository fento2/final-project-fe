"use client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";
import { useAuthUIStore } from "@/lib/zustand/uiAuthSrore";


interface ModalCheckEmailProps {
    open: boolean
    setOpen: (open: boolean) => void

}
export default function ModalCheckEmail({ open, setOpen }: ModalCheckEmailProps) {
    const { setShowSignUp } = useAuthUIStore()
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl shadow-lg">
                    <DialogHeader className="space-y-3 text-center">
                        <div className="flex justify-center">
                            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900">
                                <MailCheck className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>
                        <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                            Sign Up Successful
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                            W've sent a verification link to your email address.
                            Please check your inbox or spam folder to complete your registration.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-center">
                        <Button
                            onClick={() => {
                                setOpen(false)
                                setShowSignUp(false)
                            }
                            }
                            className="px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition"
                        >
                            Got it
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </>
    );
}
