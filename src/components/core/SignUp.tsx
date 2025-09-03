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
import InputField from "./InputField";
import Divider from "./Divider";
import { apiCall } from "@/helper/apiCall";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const router = useRouter();
  const { setShowSignIn, setShowSignUp } = useAuthUIStore();
  const [role, setRole] = useState<"USER" | "COMPANY">("USER");
  const [error, setError] = useState("");

  const [data, setData] = useState({
    role,
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleSignUp = async () => {
    setError("");
    const result = schemaSignUp.safeParse(data);
    if (!result.success) {
      const message = result.error.issues[0].message;
      setError(message);
    }
    const newData = {
      role: data.role,
      name: data.name,
      username: data.username,
      email: data.email,
      password: data.password,
    }
    const response = await apiCall.post("/auth/signup", {
      ...data
      // newData
    });
    alert(response.data);
    alert("Pendaftaran akun berhasil");
    router.push("/");
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
          <InputField
            name="name"
            value={data.name}
            placeholder={role === "USER" ? "Full Name" : "Company Name"}
            onChange={(v) => setData({ ...data, name: v })}
            leftIcon={role === "USER" ? <User className="w-4 h-4" /> : <Building className="w-4 h-4" />}
          />

          <InputField
            type="text"
            name="username"
            value={data.username}
            placeholder={"Username"}
            onChange={(v) => setData({ ...data, username: v })}
            leftIcon={<User className="w-4 h-4" />}
          />

          {/* Email */}
          <InputField
            type="email"
            name="email"
            value={data.email}
            placeholder="Email"
            onChange={(v) => setData({ ...data, email: v })}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          {/* Password */}
          <InputField
            type="password"
            name="password"
            value={data.password}
            placeholder="Password"
            onChange={(v) => setData({ ...data, password: v })}
          />

          {/* Confirm Password */}
          <InputField
            type="password"
            name="confirmPassword"
            value={data.confirmPassword}
            placeholder="Confirm Password"
            onChange={(v) => setData({ ...data, confirmPassword: v })}
            error={
              data.confirmPassword &&
                data.confirmPassword !== data.password
                ? "Password tidak sama"
                : undefined
            }
          />

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
        <Divider name="Or sign up with" />

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
