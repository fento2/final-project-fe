"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import useUserRegion from '@/lib/hooks/useUserRegion';
import { fetcher } from '@/lib/fetcher';
import useSWR from "swr";
import { SubscriptionServiceDTO, SubscriptionsSchema } from '@/types/subscription';
import formatCurrency from '@/lib/formatCurrency';
import { useRouter } from 'next/navigation';

export default function LocalizedPricing() {
    const { loading, country, countryCode, latitude, longitude } = useUserRegion();
    const router = useRouter();

    const { data, error, isLoading } = useSWR<SubscriptionServiceDTO[]>("/subscription", (url: string) => fetcher(url, SubscriptionsSchema));

    if (isLoading) return <div className="max-w-7xl mx-auto px-6 py-16"><p>Loading...</p></div>;
    if (error) return <div className="mt-4 text-sm text-red-600 text-center">{error.message}</div>;
    if (!data) return <p>Loading...</p>;

    return (
        <div className="max-w-7xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Pricing & Plans</h2>
            <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">Prices shown in your local currency when available. Rates are approximate.</p>

            <div className="text-center mb-6">
                {loading ? (
                    <div className="text-sm text-gray-500">Detecting your location...</div>
                ) : (
                    <div className="text-sm text-gray-600">{country ? `Detected: ${country} (${(countryCode ?? '').toUpperCase()})` : `Region: ${(countryCode ?? 'US').toUpperCase()}`}{latitude && longitude ? ` — ${latitude.toFixed(2)}, ${longitude.toFixed(2)}` : ''}</div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {
                    data && data.map((val, idx) => (
                        <div className="bg-white rounded-2xl p-8 shadow-md flex flex-col" key={val.subscription_id}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold">{val.name}</h3>
                                <span className="text-sm text-gray-500">{formatCurrency(val.price)}</span>
                            </div>
                            <div className="text-3xl font-extrabold text-gray-900 mb-4">{formatCurrency(val.price)}<span className="text-base font-medium text-gray-500">/mo</span></div>
                            <p className="text-sm text-gray-600 mb-6">Perfect for individuals testing the platform.</p>

                            <ul className="space-y-3 mb-6">
                                <li className="flex items-start gap-3 text-sm text-gray-700"><Check className="w-4 h-4 text-indigo-600 mt-1" /> CV Generator </li>
                                <li className="flex items-start gap-3 text-sm text-gray-700"><Check className="w-4 h-4 text-indigo-600 mt-1" />{val.name === "Standart" ? "2 attempt(s) at skill assessment" : "Unlimited attempts at skill assessment"}</li>
                            </ul>

                            <div className="mt-auto">
                                <Button className="w-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100" onClick={() => router.push("/dashboard/my-subscription")}>Start Now</Button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
