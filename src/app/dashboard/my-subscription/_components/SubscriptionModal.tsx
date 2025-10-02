import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { apiCall } from "@/helper/apiCall";
import formatCurrency from "@/lib/formatCurrency";
import formatDateID, { formatDateIDDateOnly } from "@/lib/formatDate";
import { Subscription } from "@/types/subscription";
import { X } from "lucide-react";
import { useState } from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    item?: Subscription;
    onCreated?: (item: Subscription) => void;
}

export default function SubscriptionModal({ isOpen, onClose, item, onCreated }: Props) {
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const onSubscribe = async (subscription_id: number) => {
        setLoading(true);
        try {
            alert("TES");
            const res = await apiCall.post("/userSubscription", { subscription_id, end_date: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000) });
            onCreated?.(res.data.data);
        } catch (error: any) {
            setServerError(error?.response?.data?.message);
        } finally {
            setLoading(false);
            onClose();
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <Card className="relative z-10 w-full max-w-lg bg-white rounded-lg p-6 shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">Subscription</h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </CardHeader>
                <Separator />
                <CardContent>
                    {item ? (
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xl font-semibold">{item.name}</h4>
                                <div className="text-lg text-primary font-bold">
                                    {formatCurrency(item.price)} / month
                                </div>
                            </div>

                            {typeof (item as any).description === "string" && (item as any).description.trim() !== "" && (
                                <p className="text-sm text-muted-foreground">{(item as any).description}</p>
                            )}

                            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                                <div>
                                    <div className="text-xs">Start Subscription</div>
                                    <div>{formatDateIDDateOnly(new Date().toString())}</div>
                                </div>
                                <div>
                                    <div className="text-xs">End Subscription</div>
                                    <div>{formatDateIDDateOnly(new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toString())}</div>
                                </div>
                            </div>

                            {serverError && <div className="text-sm text-red-600">{serverError}</div>}
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground">No subscription selected.</div>
                    )}
                </CardContent>
                <Separator />
                <CardFooter className="flex gap-2 justify-end">
                    <Button variant="ghost" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={() => onSubscribe(Number(item?.subscription_id))} disabled={loading || !item}>
                        {loading ? "Processing..." : item ? "Subscribe" : "Close"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}