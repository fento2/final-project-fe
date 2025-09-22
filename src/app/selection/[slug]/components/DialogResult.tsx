"use client";

import { useParams, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogResultProps {
    score: number | null;
    open: boolean;
    setOpen: (val: boolean) => void;

}

const DialogResult: React.FC<DialogResultProps> = ({ score, open, setOpen: onClose }) => {
    const router = useRouter();
    const param = useParams()

    const handleButtonClick = () => {
        onClose(false);

        router.replace(`/jobs/${param.slug}/apply`); // ganti "/lamaran" sesuai route lamaranmu

    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md rounded-2xl bg-white shadow-2xl p-8 transform transition-transform duration-300 ease-out scale-95 animate-fade-in">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-3xl font-extrabold text-gray-900">
                        Hasil Tes
                    </DialogTitle>
                    <DialogDescription className="mt-2 text-gray-600 text-base">
                        Berikut adalah skor yang Anda capai pada pre-selection test.
                    </DialogDescription>
                </DialogHeader>

                <div className="my-8 text-center">
                    <p className="text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                        {score ?? 0}
                    </p>
                    <p className="mt-2 text-gray-500 text-lg">Skor Anda</p>
                </div>

                <DialogFooter className="justify-center">
                    <Button
                        onClick={handleButtonClick}
                        className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
                    > Go To Aply
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DialogResult;
