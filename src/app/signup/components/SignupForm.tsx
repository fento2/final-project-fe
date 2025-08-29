"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RoleSelector from "./RoleSelector";
import CompanyFields from "./CompanyFields";
import SocialButtons from "../../components/SocialButtons";
import FormAuth from "@/app/components/FormAuth";
import { MoveLeft } from "lucide-react";

export default function SignupForm() {
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState<"user" | "company">("user");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (password.length < 8) {
            setError("Password harus minimal 8 karakter.");
            return;
        }
        if (password !== confirm) {
            setError("Password dan konfirmasi tidak cocok.");
            return;
        }

        if (role === "company") {
            if (!companyName.trim()) {
                setError("Nama company harus diisi untuk role company.");
                return;
            }
            if (!phone.trim()) {
                setError("Nomor telepon harus diisi untuk role company.");
                return;
            }
        }

        setLoading(true);
        try {
            console.log("signup", { role, companyName, phone, email });
            router.push("/signin");
        } catch (err) {
            setError("Gagal membuat akun. Coba lagi.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md w-full mx-auto">
            {/* Fixed Header Section */}
            <div className="sticky top-0 bg-white z-10 pb-4">
                <div className="flex gap-2 hover:underline cursor-pointer text-black/50 w-fit mb-4" onClick={() => router.push("/")}>
                    <MoveLeft />back to home
                </div>
                <h1 className="text-3xl font-extrabold mb-2">Create your account</h1>
                <p className="text-sm text-gray-600 mb-4">
                    Join JobListing and start exploring great opportunities with top companies.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <FormAuth
                    email={email}
                    onEmailChange={(e) => setEmail(e.target.value)}
                    password={password}
                    onPasswordChange={(e) => setPassword(e.target.value)}
                    showConfirm
                    confirmPassword={confirm}
                    onConfirmPasswordChange={(e) => setConfirm(e.target.value)}
                />

                <RoleSelector role={role} setRole={setRole} />

                {role === "company" && (
                    <CompanyFields
                        companyName={companyName}
                        setCompanyName={setCompanyName}
                        phone={phone}
                        setPhone={setPhone}
                    />
                )}

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                    type="submit"
                    className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-60"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create account"}
                </button>
            </form>

            <div className="my-6 flex items-center gap-3">
                <hr className="flex-1 border-t" />
                <span className="text-sm text-gray-400">Or</span>
                <hr className="flex-1 border-t" />
            </div>

            <SocialButtons mode="signup" />

            <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{" "}
                <Link href="/signin" className="text-indigo-600 hover:underline">
                    Sign in
                </Link>
            </p>

            <p className="text-xs text-gray-400 mt-8 text-center">© 2025 ALL RIGHTS RESERVED</p>
        </div>
    );
}