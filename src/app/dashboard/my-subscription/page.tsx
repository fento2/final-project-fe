"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { apiCall } from "@/helper/apiCall";
import formatCurrency from "@/lib/formatCurrency";
import formatDateID, { formatDateIDDateOnly } from "@/lib/formatDate";
import { UserSubscriptionActiveDTO } from "@/types/userSubscription";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import SubscriptionTable from "./_components/Table";
import { Button } from "@/components/ui/button";
import SubmitDialog from "../skill-assessment/_components/SubmitDialog";
import SubscriptionModal from "./_components/SubscriptionModal";
import { Subscription } from "@/types/subscription";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SubscriptionPage() {
    const [activeSub, setActiveSub] = useState<UserSubscriptionActiveDTO>();
    const [loading, setLoading] = useState(false);
    const [subsHistory, setSubsHistory] = useState<UserSubscriptionActiveDTO[]>([]);
    const [subscription, setSubscription] = useState<Subscription[]>([]);
    const [showSubscription, setShowSubscription] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription>();

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await apiCall.get("/userSubscription/user-subscription-active");
            setActiveSub(res.data.data);
            const result = await apiCall.get("/userSubscription/user-subscription-history");
            setSubsHistory(result.data.data);
            const resSubscription = await apiCall.get("/subscription");
            setSubscription(resSubscription.data.data);
            console.log(res.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleUpgrade = async () => {
        alert("TES");
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div className="w-full px-3 py-4 md:pl-26 md:pr-10">
            {activeSub ? (
                <Card className="w-full max-w-sm mx-auto">
                    <CardHeader>
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                                {/* Jika ada URL gambar, bisa dimasukkan ke AvatarImage */}
                                <AvatarImage src="" alt={activeSub.user?.username} />
                                <AvatarFallback>{activeSub.user.name}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-2xl">{activeSub.user.name}</CardTitle>
                                <CardDescription>{activeSub.user.email}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Separator />
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Paket Aktif</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xl font-semibold">{activeSub.subscription.name}</p>
                                    <p className="text-lg font-bold text-primary">{formatCurrency(activeSub.subscription.price)} / bulan</p>
                                </div>
                                {activeSub.payment_status === "APPROVED" && (
                                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:text-green-900 hover:border-green-300">
                                        Active
                                    </Badge>
                                )}
                                {activeSub.payment_status === "PENDING" && (
                                    <Badge variant="secondary">
                                        Pending
                                    </Badge>
                                )}
                                {activeSub.payment_status === "REJECTED" && (
                                    <Badge variant="destructive">
                                        Rejected
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <Separator />
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Periode Langganan</h3>
                            <div className="space-y-2 text-sm text-foreground">
                                <div className="flex items-center">
                                    <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>Aktif sejak: <strong>{activeSub.start_date && formatDateIDDateOnly(activeSub.start_date?.toString())}</strong></span>
                                </div>
                                <div className="flex items-center">
                                    <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>Berakhir pada: <strong>{activeSub.end_date && formatDateIDDateOnly(activeSub.end_date?.toString())}</strong></span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="grid gap-3">
                        {
                            activeSub.subscription.name == "Basic Plan" && (
                                // <Button variant="outline" className="w-full">
                                //     Upgrade Subs
                                // </Button>
                                <SubmitDialog onConfirm={() => handleUpgrade()} buttonTitle="Upgrade" variant="success" triggerLabel="Upgrade" title="Are you sure you want to upgrade?" description="Upgrading will change your subscription plan. Do you want to continue?" />
                            )
                        }
                        <div className="flex flex-col gap-2">
                            <Label>Upload proof of payment</Label>
                            <Input type="file" />
                            <Button className="bg-green-600 hover:bg-green-700">Submit</Button>
                        </div>
                        {/* <Button variant="destructive" className="w-full">
                                <XCircle className="mr-2 h-4 w-4" /> Batalkan Langganan
                            </Button> */}
                    </CardFooter>
                </Card>
            ) : (
                <div className="w-fit mx-auto my-12 p-6 bg-white rounded-lg shadow-sm text-center">
                    <h3 className="text-lg font-semibold mb-2">No active subscription</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        You don't have an active subscription yet. Browse available plans and choose one to get started.
                    </p>
                    <div className="grid gap-3 lg:flex lg:justify-center">
                        {
                            subscription.map((plan) => (
                                <Card key={plan.subscription_id} className="min-w-45 mx-2">
                                    <CardContent className="p-4">
                                        <div className="flex flex-col items-start gap-2">
                                            <h4 className="text-lg font-semibold">{plan.name}</h4>
                                            <div className="text-sm text-muted-foreground">
                                                {formatCurrency(plan.price)} / month
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-3">
                                        <Button className="w-full" onClick={() => { setShowSubscription(true), setSelectedSubscription(plan) }}>
                                            Subscribe
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))
                        }
                        {/* <Button onClick={() => setShowSubscription(true)}>Browse Plans</Button> */}
                    </div>
                </div>
            )}

            <SubscriptionTable
                data={subsHistory}
                loading={loading}
            />

            <SubscriptionModal
                isOpen={showSubscription}
                onClose={() => setShowSubscription(false)}
                onCreated={() => fetchData()}
                item={selectedSubscription}
            />
        </div>
    )
}