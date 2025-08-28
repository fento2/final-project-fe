"use client";

import React, { useState } from "react";
import { Mail, Lock, Check, Eye, EyeOff } from "lucide-react";

type Props = {
    email: string;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    password: string;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    // optional confirm password (untuk register)
    confirmPassword?: string;
    onConfirmPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    showConfirm?: boolean;
    className?: string;
};

export default function FormAuth({
    email,
    onEmailChange,
    password,
    onPasswordChange,
    confirmPassword,
    onConfirmPasswordChange,
    showConfirm = false,
    className = "",
}: Props) {
    const [showPwd, setShowPwd] = useState(false);

    return (
        <div className={className}>
            {/* Email */}
            <label className="block text-sm">
                <span className="text-gray-700">Email</span>
                <div className="mt-1 relative">
                    <input
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={onEmailChange}
                        placeholder="Example@email.com"
                        className="w-full pl-10 pr-3 py-3 border rounded-lg bg-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                    <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
                </div>
            </label>

            {/* Password */}
            <label className="block text-sm mt-3">
                <span className="text-gray-700">Password</span>
                <div className="mt-1 relative">
                    <input
                        name="password"
                        type={showPwd ? "text" : "password"}
                        required
                        minLength={8}
                        value={password}
                        onChange={onPasswordChange}
                        placeholder="At least 8 characters"
                        className="w-full pl-10 pr-10 py-3 border rounded-lg bg-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                    <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
                    <button
                        type="button"
                        onClick={() => setShowPwd((s) => !s)}
                        className="absolute right-3 top-3 text-gray-500"
                        aria-label={showPwd ? "Hide password" : "Show password"}
                    >
                        {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </label>

            {/* Confirm password (optional) */}
            {showConfirm && onConfirmPasswordChange !== undefined && (
                <label className="block text-sm mt-3">
                    <span className="text-gray-700">Confirm password</span>
                    <div className="mt-1 relative">
                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            minLength={8}
                            value={confirmPassword ?? ""}
                            onChange={onConfirmPasswordChange}
                            placeholder="Repeat password"
                            className="w-full pl-10 pr-3 py-3 border rounded-lg bg-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                        <Check className="absolute left-3 top-3 text-gray-400" size={16} />
                    </div>
                </label>
            )}
        </div>
    );
}