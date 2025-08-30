"use client";
import * as React from "react";
import { useState } from "react";
import {
  UserPlus,
  Lock,
  Mail,
  X,
  Eye,
  EyeOff,
  User,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthUIStore } from "@/lib/zustand/authUIASrore";
import WithSosmed from "./WithSomed";
import { schemaSignUp } from "@/validation/auth.validation";

const SignUp = () => {
  const { setShowSignIn, setShowSignUp } = useAuthUIStore();
  const [role, setRole] = useState<"USER" | "COMPANY">("USER");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [data, setData] = useState({
    role,
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleSignUp = () => {
    setError("");
    const result = schemaSignUp.safeParse(data);
    if (!result.success) {
      const message = result.error.issues[0].message;
      setError(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowSignUp(false)}
      />

      {/* Card */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center border border-gray-200 text-black z-10">
        {/* Close button */}
        <button
          onClick={() => setShowSignUp(false)}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
        >
          <X />
        </button>

        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-50 mb-6 shadow-lg">
          <UserPlus className="w-7 h-7 text-black" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-center">
          Create your account
        </h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Join us and start creating your docs today.
        </p>

        {/* Input fields */}

        <div className="w-full flex flex-col gap-3 mb-2">
          {/* Role selection */}
          <div className="flex items-center gap-4 mb-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="role"
                value="USER"
                checked={role === "USER"}
                onChange={() => setRole("USER")}
              />
              User
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="role"
                value="COMPANY"
                checked={role === "COMPANY"}
                onChange={() => setRole("COMPANY")}
              />
              Company
            </label>
          </div>

          {/* Name */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {role === "USER" ? (
                <User className="w-4 h-4" />
              ) : (
                <Building className="w-4 h-4" />
              )}
            </span>
            <input
              placeholder={role === "USER" ? "Full Name" : "Company Name"}
              type="text"
              value={data.name}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              placeholder="Email"
              type="email"
              value={data.email}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={data.password}
              className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            {/* Toggle password */}
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

          {/* Confirm Password */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              placeholder="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={data.confirmPassword}
              className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
              onChange={(e) =>
                setData({ ...data, confirmPassword: e.target.value })
              }
            />
            {/* Toggle confirm password */}
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Error */}
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>

        {/* Sign up button */}
        <Button
          type="submit"
          onClick={handleSignUp}
          className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-medium py-2 rounded-xl shadow hover:brightness-105 cursor-pointer transition mb-4 mt-2"
        >
          Sign Up
        </Button>

        {/* Divider */}
        <div className="flex items-center w-full my-2">
          <div className="flex-grow border-t border-dashed border-gray-200"></div>
          <span className="mx-2 text-xs text-gray-400">Or sign up with</span>
          <div className="flex-grow border-t border-dashed border-gray-200"></div>
        </div>

        {/* Social buttons */}
        <WithSosmed />

        {/* Link to Sign in */}
        <p className="text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <button
            onClick={() => {
              setShowSignUp(false);
              setShowSignIn(true);
            }}
            className="text-blue-600 font-medium hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
