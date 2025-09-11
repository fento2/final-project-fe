import React from "react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Props {
    disabled?: boolean;
    onConfirm: () => void;
    triggerLabel?: string;
}

export default function SubmitDialog({ disabled = false, onConfirm, triggerLabel = "Submit Ujian" }: Props) {
    const btnClass = `px-4 py-2 text-white rounded shadow-sm active:scale-95 ${disabled ? "bg-indigo-600 opacity-50 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-800 cursor-pointer"}`;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button type="button" disabled={disabled} className={btnClass}>
                    {triggerLabel}
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Yakin submit ujian?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Setelah submit, jawaban tidak dapat diubah. Lanjutkan submit?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onConfirm()}>Submit</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}