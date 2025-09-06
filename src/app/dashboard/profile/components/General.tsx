"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck, Edit2, UserCircle2 } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import FormProfile from "./FormProfile";
import { fetchUUpdateProfile, UpdateProfileProps } from "@/fetch/profile.fetch";
import axios from "axios";
import { useToast } from "@/components/basic-toast";
const General = () => {
  const [profile, setProfile] = useState<UpdateProfileProps>({
    name: "",
    username: "asdasd",
    email: "asdada",
    phone: "",
    gender: "",
    birthDate: "",
    avatar: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('')
  const toast = useToast()
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    const res = await fetchUUpdateProfile(profile, setError, setLoading)
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.message)
    }
    setProfile(profile)
  }

  return (
    <div className="mx-auto py-6">
      {/* Card */}
      <Card className="">
        <CardHeader
          className="text-2xl font-bold tracking-widest text-indigo-600
        "
        >
          Profile Information
          <p className="text-sm font-normal text-gray-500 mt-1">
            Your main account details that will be visible on your profile
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
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
                  <UserCircle2 size={250} />
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
              {<div className="flex gap-2 border-2 bg-transparent border-indigo-700 px-3 py-1 items-center text-indigo-500 font-bold rounded-full">
                Verified <BadgeCheck className="text-indigo-800 w-5 h-5" />
              </div>}
            </div>
          </div>

          <FormProfile
            name={profile.name}
            username={profile.username}
            email={profile.email}
            phone={profile.phone}
            handleChange={handleChange}
            editing={editing}
          />

          {/* Gender + Birthdate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 -mt-4">
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
                  <SelectItem value="Male" className="p-4 text-lg">
                    Male
                  </SelectItem>
                  <SelectItem value="Female" className="p-4 text-lg">
                    Female
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-lg">Date of Birth</Label>
              <Input
                type="date"
                name="birthdate"
                value={profile.birthDate}
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
export default General;
