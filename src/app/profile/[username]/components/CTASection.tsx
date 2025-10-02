"use client";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
    user: any;
    onCTAClick: () => void;
}

export default function CTASection({ user, onCTAClick }: CTASectionProps) {
    return (
        <div className="container mx-auto px-4 my-10 max-w-2xl">
            <div className="rounded-2xl bg-indigo-600 text-white p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-lg">
                <div>
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                        Join Horizon Jobs today and take the next step in your career!
                    </h3>
                    <p className="text-sm text-indigo-100 mt-2">
                        With our user-friendly platform and up-to-date job listings, you'll be on your way to a fulfilling career in no time.
                    </p>
                </div>
                <Button
                    onClick={onCTAClick}
                    variant="secondary"
                    className="self-start md:self-auto"
                >
                    {user ? "Go to Dashboard" : "Join Now"}
                </Button>
            </div>
        </div>
    );
}