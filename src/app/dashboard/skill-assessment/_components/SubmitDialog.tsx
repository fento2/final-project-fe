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
import { Button } from "@/components/ui/button";

interface Props {
    disabled?: boolean;
    onConfirm: () => void;
    triggerLabel?: string;
    title?: string;
    description?: string;
    buttonTitle?: string;
    variant?: "submit" | "delete";
    icon?: React.ReactNode;
}

export default function SubmitDialog({ disabled = false, onConfirm, triggerLabel = "Submit Ujian", title = "Yakin submit ujian?", description = "Setelah submit, jawaban tidak dapat diubah. Lanjutkan submit?", buttonTitle = "Submit", variant = "submit", icon }: Props) {
    // const btnClass = `px-4 py-2 text-white rounded shadow-sm active:scale-95 ${disabled ? "bg-blue-700 opacity-50 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800 cursor-pointer"}`;
    const btnClass = `px-4 py-2 text-white shadow-sm active:scale-95 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${variant === "delete" ? "bg-red-600 hover:bg-red-700" : "bg-blue-700 hover:bg-blue-800"}`;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button type="button" disabled={disabled} className={btnClass}>
                    {icon && <span>{icon}</span>}
                    {triggerLabel}
                </Button>
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
                    <AlertDialogAction className={btnClass} onClick={() => onConfirm()}>{buttonTitle}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}