"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import useUserRegion from '@/lib/hooks/useUserRegion';

type RateInfo = { currency: string; rate: number; locale?: string };

const RATES: Record<string, RateInfo> = {
    us: { currency: 'USD', rate: 1, locale: 'en-US' },
    id: { currency: 'IDR', rate: 15000, locale: 'id-ID' },
    gb: { currency: 'GBP', rate: 0.78, locale: 'en-GB' },
    de: { currency: 'EUR', rate: 0.92, locale: 'de-DE' },
    fr: { currency: 'EUR', rate: 0.92, locale: 'fr-FR' },
    au: { currency: 'AUD', rate: 1.5, locale: 'en-AU' },
    jp: { currency: 'JPY', rate: 145, locale: 'ja-JP' },
    in: { currency: 'INR', rate: 83, locale: 'en-IN' },
};

const BASE_PRICES_USD = { starter: 0, pro: 49 };

export default function LocalizedPricing() {
    const { loading, country, countryCode, latitude, longitude, error } = useUserRegion();

    function getRateInfo() {
        const cc = (countryCode ?? 'us') as string;
        return RATES[cc] ?? RATES['us'];
    }

    function format(amountUsd: number) {
        const info = getRateInfo();
        const value = Math.round((amountUsd * info.rate + Number.EPSILON) * 100) / 100;
        try {
            return new Intl.NumberFormat(info.locale ?? navigator.language, { style: 'currency', currency: info.currency }).format(value);
        } catch (_) {
            return `${info.currency} ${value}`;
        }
    }

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
                {/* Starter */}
                <div className="bg-white rounded-2xl p-8 shadow-md flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">Starter</h3>
                        <span className="text-sm text-gray-500">Free</span>
                    </div>
                    <div className="text-3xl font-extrabold text-gray-900 mb-4">{format(BASE_PRICES_USD.starter)}<span className="text-base font-medium text-gray-500">/mo</span></div>
                    <p className="text-sm text-gray-600 mb-6">Perfect for individuals testing the platform.</p>

                    <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-3 text-sm text-gray-700"><Check className="w-4 h-4 text-indigo-600 mt-1" /> 5 job posts / month</li>
                        <li className="flex items-start gap-3 text-sm text-gray-700"><Check className="w-4 h-4 text-indigo-600 mt-1" /> Basic candidate search</li>
                        <li className="flex items-start gap-3 text-sm text-gray-700"><Check className="w-4 h-4 text-indigo-600 mt-1" /> Community support</li>
                    </ul>

                    <div className="mt-auto">
                        <Button className="w-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100">Start for Free</Button>
                    </div>
                </div>

                {/* Pro */}
                <div className="relative bg-white rounded-2xl p-8 shadow-lg ring-2 ring-indigo-50 flex flex-col">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="inline-flex items-center gap-2 bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">Popular</div>
                    </div>

                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold">Pro</h3>
                            <span className="text-sm text-gray-500">For small teams</span>
                        </div>
                        <div className="text-4xl font-extrabold text-gray-900 mb-4">{format(BASE_PRICES_USD.pro)}<span className="text-base font-medium text-gray-500">/mo</span></div>
                        <p className="text-sm text-gray-600 mb-6">Everything you need to hire faster and manage candidates efficiently.</p>

                        <ul className="space-y-3 mb-6">
                            <li className="flex items-start gap-3 text-sm text-gray-700"><Check className="w-4 h-4 text-indigo-600 mt-1" /> 50 job posts / month</li>
                            <li className="flex items-start gap-3 text-sm text-gray-700"><Check className="w-4 h-4 text-indigo-600 mt-1" /> Advanced candidate search & filters</li>
                            <li className="flex items-start gap-3 text-sm text-gray-700"><Check className="w-4 h-4 text-indigo-600 mt-1" /> Interview scheduling & analytics</li>
                            <li className="flex items-start gap-3 text-sm text-gray-700"><Check className="w-4 h-4 text-indigo-600 mt-1" /> Email support</li>
                        </ul>

                        <div className="mt-auto">
                            <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700">Start Trial</Button>
                        </div>
                    </div>
                </div>

                {/* Enterprise */}
                <div className="bg-white rounded-2xl p-8 shadow-md flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">Enterprise</h3>
                        <span className="text-sm text-gray-500">Custom</span>
                    </div>
                    <div className="text-3xl font-extrabold text-gray-900 mb-4">Contact Us</div>
                    <p className="text-sm text-gray-600 mb-6">Custom solutions for large organizations, single sign-on, and dedicated support.</p>

                    <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-3 text-sm text-gray-700"><Check className="w-4 h-4 text-indigo-600 mt-1" /> Unlimited job posts</li>
                        <li className="flex items-start gap-3 text-sm text-gray-700"><Check className="w-4 h-4 text-indigo-600 mt-1" /> Dedicated account manager</li>
                        <li className="flex items-start gap-3 text-sm text-gray-700"><Check className="w-4 h-4 text-indigo-600 mt-1" /> Custom integrations & SSO</li>
                        <li className="flex items-start gap-3 text-sm text-gray-700"><Check className="w-4 h-4 text-indigo-600 mt-1" /> Priority support</li>
                    </ul>

                    <div className="mt-auto">
                        <Button className="w-full bg-white border border-indigo-600 text-indigo-600">Talk to Sales</Button>
                    </div>
                </div>
            </div>

            {error && <div className="mt-4 text-sm text-red-600 text-center">{error}</div>}
        </div>
    );
}
