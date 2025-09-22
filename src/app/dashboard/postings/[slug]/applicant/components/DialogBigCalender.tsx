"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputDialogMultiProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    dialogLabel: string;
    titleValue: string;
    setTitleValue: (value: string) => void;
    locationValue: string;
    setLocationValue: (value: string) => void;
    onConfirm: (title: string, location: string) => void;
}

export default function InputDialogMulti({
    open,
    setOpen,
    dialogLabel,
    titleValue,
    setTitleValue,
    locationValue,
    setLocationValue,
    onConfirm,
}: InputDialogMultiProps) {
    const titleRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (open) {
            setTimeout(() => titleRef.current?.focus(), 50);
        }
    }, [open]);

    const handleConfirm = () => {
        const trimmedTitle = titleValue.trim();
        const trimmedLocation = locationValue.trim();
        if (!trimmedTitle) return;
        onConfirm(trimmedTitle, trimmedLocation);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{dialogLabel}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-1">
                        <Label htmlFor="title">Judul Interview</Label>
                        <Input
                            id="title"
                            ref={titleRef}
                            value={titleValue}
                            onChange={(e) => setTitleValue(e.target.value)}
                            placeholder="Masukkan judul interview"
                        />
                    </div>
                    <div className="grid gap-1">
                        <Label htmlFor="location">Lokasi / Zoom</Label>
                        <Input
                            id="location"
                            value={locationValue}
                            onChange={(e) => setLocationValue(e.target.value)}
                            placeholder="Contoh: Online / Office"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>
                        Batal
                    </Button>
                    <Button onClick={handleConfirm}>Simpan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
