"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck, Edit2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProfileUser = () => {
  const [profile, setProfile] = useState({
    name: "Fendry Tonrate",
    username: "fendrytonrate",
    email: "fendry@example.com",
    phone: "08123456789",
    gender: "Male",
    birthdate: "2000-01-01",
    avatar: "/default-avatar.png",
  });

  const [editing, setEditing] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setEditing(false);
    console.log("Updated Profile:", profile);
    // TODO: call API update profile di sini
  };

  return (
    <div className="container md:pl-20 mx-auto min-h-screen px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-indigo-500 -tracking-wider">
          Personal Data
        </h3>
        <span className="text-sm text-gray-600">
          Fill in the data according to your ID card.
        </span>
      </div>

      {/* Card */}
      <Card className="">
        <CardContent className="p-6 space-y-6">
          {/* Avatar + Status */}
          <div className="flex flex-col sm:flex-row gap-6 sm:items-center relative">
            <div className="relative w-28 h-28 mx-auto sm:mx-0">
              <Avatar className="w-28 h-28 rounded-full">
                <AvatarImage
                  src={profile.avatar}
                  alt={profile.name}
                  className="rounded-full object-cover"
                />
                <AvatarFallback className="rounded-full bg-indigo-200 text-indigo-800">
                  {profile.name[0]}
                </AvatarFallback>
              </Avatar>

              {editing && (
                <Label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 rounded-full cursor-pointer hover:bg-black/60 transition"
                >
                  <Edit2 className="w-5 h-5 text-white mb-1" />
                  <span className="text-white text-xs font-medium">
                    Upload Foto
                  </span>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const imgUrl = URL.createObjectURL(file);
                        setProfile({ ...profile, avatar: imgUrl });
                      }
                    }}
                  />
                </Label>
              )}
            </div>

            {/* Status */}
            <div className="flex flex-col gap-2 items-center sm:items-start">
              <span className="text-gray-500 font-bold tracking-tighter">
                Status
              </span>
              <div className="flex gap-2 border-2 bg-transparent border-indigo-700 px-3 py-1 items-center text-indigo-500 font-bold rounded-full">
                Verified <BadgeCheck className="text-indigo-800 w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Name + Username */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-lg">Name</Label>
              <Input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!editing}
                className="py-6 !text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-lg">Username</Label>
              <Input
                type="text"
                name="username"
                value={profile.username}
                onChange={handleChange}
                disabled={!editing}
                className="py-6 !text-lg"
              />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-lg">Email</Label>
              <Input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!editing}
                className="py-6 !text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-lg">Phone</Label>
              <Input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!editing}
                className="py-6 !text-lg"
              />
            </div>
          </div>

          {/* Gender + Birthdate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-lg">Gender</Label>
              <Select
                value={profile.gender}
                onValueChange={(value) =>
                  setProfile({ ...profile, gender: value })
                }
                disabled={!editing}
              >
                <SelectTrigger className="py-6 !text-lg w-full">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male" className="text-lg">
                    Male
                  </SelectItem>
                  <SelectItem value="Female" className="text-lg">
                    Female
                  </SelectItem>
                  <SelectItem value="Other" className="text-lg">
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-lg">Date of Birth</Label>
              <Input
                type="date"
                name="birthdate"
                value={profile.birthdate}
                onChange={handleChange}
                disabled={!editing}
                className="py-6 !text-lg"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {editing ? (
              <>
                <Button
                  onClick={handleSave}
                  className="bg-indigo-500 text-white w-full sm:w-auto"
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditing(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setEditing(true)}
                className="w-full sm:w-auto"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileUser;
