"use client";
import * as React from "react";
import { useState } from "react";
import { LogIn, Lock, Mail, X, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthUIStore } from "@/lib/zustand/authUIASrore";
import WithSosmed from "./WithSomed";
import { schemaSignIn } from "@/validation/auth.validation";
import { apiCall } from "@/helper/apiCall";
import { useAuthStore } from "@/lib/zustand/authStore";
import { Dots_v2 } from "../ui/spinner";
import axios from "axios";
import { useToast } from "../basic-toast";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
const SignIn = () => {
  const { setShowSignIn, setShowSignUp } = useAuthUIStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)
  const [remember, setRemember] = useState(false)
  const toast = useToast()
  const { setIsLogin, setChekLogin, setAuth } = useAuthStore()
  const handleSignIn = async () => {
    try {
      setError("");
      const result = schemaSignIn.safeParse({ email, password, remember });
      if (!result.success) {
        const messages = result.error.issues[0].message;
        return setError(messages);
      }
      const { data } = await apiCall.post('/auth/sign-in', {
        email,
        password,
        remember
      })
      if (data.success) {
        setIsLogin(true);
        setAuth(data.email, data.role)
        setShowSignIn(false)
        toast.success(data.message)
        console.log(data)
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message)
      }
      console.log(error)
    } finally {
      setChekLogin(false)
      setLoading(false)
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay hitam transparan */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowSignIn(false)}
      />
      {loading && <div className="absolute z-50 flex justify-center h-screen w-full">
        <Dots_v2 />

      </div>}

      {/* Card */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center border border-gray-200 text-black z-10">
        {/* Tombol X */}
        <button
          onClick={() => setShowSignIn(false)}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
        >
          <X />
        </button>

        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-50 mb-6 shadow-lg">
          <LogIn className="w-7 h-7 text-black" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-center">
          Sign in with email
        </h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Make a new doc to bring your words, data, and teams together. For free
        </p>

        {/* Input fields */}
        <div className="w-full flex flex-col gap-3 mb-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              placeholder="Email"
              type="email"
              value={email}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Tombol toggle show/hide password */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="w-full flex justify-between items-center text-sm">
            <button className="text-xs hover:underline font-medium">
              Forgot password?
            </button>
            {error && <span className="text-red-500 text-xs">{error}</span>}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="remember"
              checked={remember}
              onCheckedChange={(val) => setRemember(val === true)} />
            <Label htmlFor="remember" className="text-sm text-gray-900 dark:text-gray-300"
            >
              Remember me
            </Label>
          </div>
        </div>

        {/* Sign in button */}
        <Button
          onClick={handleSignIn}
          className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-medium py-2 rounded-xl shadow hover:brightness-105 cursor-pointer transition mb-4 mt-2"
        >
          Sign In
        </Button>

        {/* Divider */}
        <div className="flex items-center w-full my-2">
          <div className="flex-grow border-t border-dashed border-gray-200"></div>
          <span className="mx-2 text-xs text-gray-400">Or sign in with</span>
          <div className="flex-grow border-t border-dashed border-gray-200"></div>
        </div>

        {/* Social buttons */}
        <WithSosmed />

        {/* Link ke Sign up */}
        <p className="text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <button
            onClick={() => {
              setShowSignIn(false);
              setShowSignUp(true);
            }}
            className="text-blue-600 font-medium hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};
export default SignIn;
