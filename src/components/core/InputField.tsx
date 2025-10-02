"use client"
import { Eye, EyeOff, Lock } from "lucide-react";
import { ReactNode, useState } from "react";

interface InputFieldProps {
    type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
    name?: string;
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    error?: string;
    passwordToggle?: boolean;
    disabled?: boolean;
    leftIcon?: ReactNode;
}

export default function InputField({
    type = "text",
    name,
    value,
    onChange,
    label,
    placeholder,
    error,
    passwordToggle,
    disabled,
    leftIcon,
}: InputFieldProps) {
    const isPassword = type === "password";
    const allowToggle = isPassword && (passwordToggle ?? true);
    const [show, setShow] = useState(false);

    const inputType = isPassword ? (show ? "text" : "password") : type;
    const showLeftIcon = !!leftIcon || isPassword;
    const renderedLeftIcon = leftIcon ? leftIcon : (isPassword ? <Lock className="w-4 h-4" /> : null);

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={name}
                    className="mb-1 block text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {showLeftIcon && renderedLeftIcon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {renderedLeftIcon}
                    </span>
                )}

                <input
                    id={name}
                    // dynamic type
                    type={inputType}
                    name={name}
                    value={value}
                    disabled={disabled}
                    placeholder={placeholder || (isPassword ? "Password" : "")}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full ${showLeftIcon ? "pl-10" : "pl-4"} ${allowToggle ? "pr-10" : "pr-4"
                        } py-2 rounded-xl border ${error ? "border-red-400" : "border-gray-200"
                        } focus:outline-none focus:ring-2 ${error ? "focus:ring-red-200" : "focus:ring-blue-200"
                        } bg-gray-50 text-sm text-black disabled:opacity-50`}
                    aria-invalid={!!error}
                />

                {allowToggle && (
                    <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
                        tabIndex={-1}
                    >
                        {show ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                )}
            </div>

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    )
}