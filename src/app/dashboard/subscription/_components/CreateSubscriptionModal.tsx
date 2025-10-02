"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiCall } from "@/helper/apiCall";
import { Subscription, SubscriptionCreateDTO, SubscriptionCreateSchema } from "@/types/subscription";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    // onCreated?: (item: Subscription) => void;
    onCreated: () => void;
}

export default function CreateSubscriptionModal({ isOpen, onClose, onCreated }: Props) {
    const [serverError, setServerError] = useState("");

    const { register, handleSubmit, reset, formState } = useForm<SubscriptionCreateDTO>({
        resolver: zodResolver(SubscriptionCreateSchema),
        defaultValues: { name: "", price: 0 },
    });

    const onSubmit = async (values: SubscriptionCreateDTO) => {
        setServerError("");
        try {
            const res = await apiCall.post("/subscription", values);
            onCreated();
            reset();
            onClose();
        } catch (error: any) {
            setServerError(error?.response?.data?.message || "Create failed");
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <form action="" onSubmit={handleSubmit(onSubmit)} className="relative z-10 w-full max-w-md bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Create Subscription</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="grid gap-3">
                    <div className="grid gap-1">
                        <Label>Name subscription</Label>
                        <Input type="text" {...register("name")} />
                        {
                            formState.errors.name && (
                                <p className="text-sm text-red-500">
                                    {formState.errors.name.message}
                                </p>
                            )
                        }
                    </div>
                    <div className="grid gap-1">
                        <Label>Name subscription</Label>
                        <Input
                            type="number"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            min={0}
                            {...register("price", { valueAsNumber: true })}
                            onKeyDown={(e) => {
                                if (e.key === '-' || e.key === 'e' || e.key === '+') {
                                    e.preventDefault();
                                }
                            }}
                            onPaste={(e) => {
                                const paste = e.clipboardData.getData('text');
                                if (/[^0-9.]/.test(paste) || paste.includes('-')) {
                                    e.preventDefault();
                                }
                            }}
                        />
                        {
                            formState.errors.price && (
                                <p className="text-sm text-red-500">
                                    {formState.errors.price.message}
                                </p>
                            )
                        }
                    </div>
                </div>
                {serverError && (
                    <p className="mt-2 text-sm text-red-500">{serverError}</p>
                )}
                <div className="mt-4 flex justify-end gap-2">
                    <Button
                        type="button"
                        onClick={onClose}
                        // className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                        variant="destructive"
                        disabled={formState.isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-green-700 hover:bg-green-700 hover:opacity-95"
                        disabled={formState.isSubmitting}
                    >
                        {formState.isSubmitting ? "Saving..." : "Create"}
                    </Button>
                </div>
            </form>
        </div>
    )
}