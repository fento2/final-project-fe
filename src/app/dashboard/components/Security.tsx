"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { schemaChangePassword } from "@/validation/auth.validation";
import { useToast } from "@/components/basic-toast";
import { apiCall } from "@/helper/apiCall";

const Security = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const toast = useToast()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const onBtChangePassword = async () => {
    try {
      console.log('run')
      const result = schemaChangePassword.safeParse(form)
      if (!result.success) {
        const messages = result.error.issues[0].message;
        return toast.error(messages)
      }
      const payload = {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      }
      const { data } = await apiCall.post('/auth/change-password', payload)
      if (data.success) {
        toast.success(data.message)
      }
      console.log(data)
    } catch (error: any) {
      if (error.status === 409) {
        toast.error('yor account register with google')
      }
      console.log(error)
    }
  }
  return (
    <div className="mx-auto min-h-screen py-6">
      {/* Card */}
      <Card>
        <CardHeader className="text-2xl font-bold tracking-widest text-indigo-600">
          Security
          <p className="text-sm font-normal text-gray-500 mt-1">
            Manage your account security and change your password.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col gap-6">
            {/* Current Password */}
            <div className="space-y-2">
              <Label className="text-lg">Current Password</Label>
              <div className="relative">
                <Input
                  type={showPassword.current ? "text" : "password"}
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                  className="py-6 !text-lg pr-10"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword.current ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label className="text-lg">New Password</Label>
              <div className="relative">
                <Input
                  type={showPassword.new ? "text" : "password"}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Enter your new password"
                  className="py-6 !text-lg pr-10"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      new: !prev.new,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword.new ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label className="text-lg">Confirm New Password</Label>
              <div className="relative">
                <Input
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your new password"
                  className="py-6 !text-lg pr-10"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword.confirm ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <Link href={'/forget-password'}>
              <span className="hover:underline cursor-pointer">Forget Password</span>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              onClick={onBtChangePassword}
              type="button"
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Security;
