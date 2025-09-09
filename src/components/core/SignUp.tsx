"use client";
import * as React from "react";
import { useState } from "react";
import {
  UserPlus,
  Mail,
  X,
  User,
  Building,
  AtSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthUIStore } from "@/lib/zustand/authUIASrore";
import WithSosmed from "./WithSomed";
import { schemaSignUp } from "@/validation/auth.validation";
import InputField from "./InputField";
import Divider from "./Divider";
import { apiCall } from "@/helper/apiCall";
import { useRouter } from "next/navigation";
import { Dots_v2 } from "../ui/spinner";
import { useToast } from "../basic-toast";
import RadioButtonSignUp from "./RadioButtonSignUp";
import axios from "axios";
import ModalCheckEmail from "./ModalCheckEmail";
const SignUp = () => {
  const router = useRouter();
  const { setShowSignIn, setShowSignUp } = useAuthUIStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const [checkEmail, setCheckEmail] = useState(false)
  const [dataSignUp, setDataSignUp] = useState({
    role: 'USER',
    companyName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleSignUp = async () => {
    try {
      setError("");
      setLoading(true);
      const result = schemaSignUp.safeParse(dataSignUp);
      if (!result.success) {
        const message = result.error.issues[0].message;
        return setError(message);
      }
      const { confirmPassword, ...payload } = dataSignUp
      const { data } = await apiCall.post("/auth/signup", payload);
      if (data.success) {
        setCheckEmail(true)
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message)

      }
      console.log(error)
    } finally {
      setLoading(false)
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowSignUp(false)}
      />
      {loading && <div className="absolute z-50 flex justify-center h-screen w-full">
        <Dots_v2 />

      </div>
      }
      <ModalCheckEmail open={checkEmail} setOpen={setCheckEmail} />
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
          <RadioButtonSignUp dataSignUp={dataSignUp} setDataSignUp={setDataSignUp} />
          {/* Name */}
          <InputField
            name="name"
            type='text'
            value={dataSignUp.name}
            placeholder={dataSignUp.role === "USER" ? "Full Name" : "Company Name"}
            onChange={(v) => setDataSignUp({ ...dataSignUp, companyName: v })}
            leftIcon={dataSignUp.role === "USER" ? <User className="w-4 h-4" /> : <Building className="w-4 h-4" />}
          />
          {/* username */}
          <InputField
            name="username"
            type='text'
            value={dataSignUp.username}
            placeholder="Usernmae"
            onChange={(v) => setDataSignUp({ ...dataSignUp, username: v })}
            leftIcon={<AtSign className="w-4 h-4" />}
          />
          {/* Email */}
          <InputField
            type="email"
            name="email"
            value={dataSignUp.email}
            placeholder="Email"
            onChange={(v) => setDataSignUp({ ...dataSignUp, email: v })}
            leftIcon={<Mail className="w-4 h-4" />}
          />
          {/* Password */}
          <InputField
            type="password"
            name="password"
            value={dataSignUp.password}
            placeholder="Password"
            onChange={(v) => setDataSignUp({ ...dataSignUp, password: v })}
          />
          {/* Confirm Password */}
          <InputField
            type="password"
            name="confirmPassword"
            value={dataSignUp.confirmPassword}
            placeholder="Confirm Password"
            onChange={(v) => setDataSignUp({ ...dataSignUp, confirmPassword: v })}
            error={
              dataSignUp.confirmPassword &&
                dataSignUp.confirmPassword !== dataSignUp.password
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
        <WithSosmed role={dataSignUp.role} setLoading={setLoading} url="sign-up" />

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
