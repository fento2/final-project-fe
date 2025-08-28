"use client";
import React from "react";

type SocialButtonsProps = {
    mode?: "signup" | "signin";
    onGoogleClick?: () => void;
    onFacebookClick?: () => void;
    className?: string;
    showText?: boolean; // jika false, hanya tampilkan ikon
};

export default function SocialButtons({
    mode = "signup",
    onGoogleClick,
    onFacebookClick,
    className = "",
    showText = true,
}: SocialButtonsProps) {
    const actionLabel = mode === "signup" ? "Sign up" : "Sign In";

    return (
        <div className={`space-y-3 ${className}`}>
            <button
                type="button"
                onClick={onGoogleClick}
                aria-label={`${actionLabel} with Google`}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-lg bg-white hover:bg-gray-50"
            >
                {/* Google icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M21.35 11.1h-9.18v2.92h5.26c-.23 1.4-.94 2.59-2.01 3.38v2.8h3.26c1.9-1.75 2.99-4.33 2.99-7.1 0-.68-.07-1.34-.31-1.92z" fill="#4285F4" />
                    <path d="M12.17 22c2.7 0 4.97-.9 6.63-2.43l-3.26-2.8c-.9.6-2.05.97-3.37.97-2.6 0-4.8-1.75-5.59-4.12H3.06v2.59C4.73 19.9 8.14 22 12.17 22z" fill="#34A853" />
                    <path d="M6.58 13.62A6.94 6.94 0 016.3 12c0-.6.1-1.18.28-1.74V7.67H3.06A9.99 9.99 0 002 12c0 1.6.36 3.12 1.02 4.48l3.56-2.86z" fill="#FBBC05" />
                    <path d="M12.17 6.02c1.47 0 2.8.51 3.85 1.51l2.88-2.88C17.12 2.95 14.85 2 12.17 2 8.14 2 4.73 4.1 3.06 7.67l3.52 2.59c.78-2.37 2.99-4.12 5.59-4.12z" fill="#EA4335" />
                </svg>
                {showText && <span className="text-sm text-gray-700">{actionLabel} with Google</span>}
            </button>

            <button
                type="button"
                onClick={onFacebookClick}
                aria-label={`${actionLabel} with Facebook`}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-lg bg-white hover:bg-gray-50"
            >
                {/* Facebook icon */}
                <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M22 12.07C22 6.49 17.52 2 11.94 2 6.36 2 1.88 6.49 1.88 12.07c0 4.99 3.66 9.14 8.44 9.94v-7.04H8.08v-2.9h2.24V9.41c0-2.22 1.31-3.44 3.32-3.44.96 0 1.96.17 1.96.17v2.16h-1.11c-1.09 0-1.43.68-1.43 1.38v1.66h2.43l-.39 2.9h-2.04V22c4.78-.8 8.44-4.95 8.44-9.93z" />
                </svg>
                {showText && <span className="text-sm text-gray-700">{actionLabel} with Facebook</span>}
            </button>
        </div>
    );
}