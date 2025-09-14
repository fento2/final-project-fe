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
    title?: string;
    description?: string;
    buttonTitle?: string;
}

export default function SubmitDialog({ disabled = false, onConfirm, triggerLabel = "Submit Ujian", title = "Yakin submit ujian?", description = "Setelah submit, jawaban tidak dapat diubah. Lanjutkan submit?", buttonTitle = "Submit" }: Props) {
    const btnClass = `px-4 py-2 text-white rounded shadow-sm active:scale-95 ${disabled ? "bg-blue-700 opacity-50 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800 cursor-pointer"}`;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button type="button" disabled={disabled} className={btnClass}>
                    {triggerLabel}
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onConfirm()}>{buttonTitle}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}