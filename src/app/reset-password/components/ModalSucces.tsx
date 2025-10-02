"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthUIStore } from "@/lib/zustand/uiAuthSrore";

interface ModalSuccseseProps {
    open: boolean
    setOpen: (val: boolean) => void
}
const ModalSuccess = ({ open, setOpen }: ModalSuccseseProps) => {
    const router = useRouter();
    const { setShowSignIn } = useAuthUIStore()

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md rounded-2xl shadow-lg">
                <DialogHeader className="text-center space-y-2">
                    <div className="flex justify-center mb-2">
                        <ShieldCheck className="w-14 h-14 text-indigo-500" />
                    </div>
                    <DialogTitle className="text-xl font-semibold">
                        Password Updated
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                        Your password has been changed successfully.
                        You can now log in with your new credentials.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-center">
                    <Button
                        onClick={() => {
                            setOpen(false);
                            router.push("/");
                            setShowSignIn(true)
                        }}
                        className=" px-6 bg-indigo-500 hover:bg-indigo-800"
                    >
                        Go to Login
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ModalSuccess;
