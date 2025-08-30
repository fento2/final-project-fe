"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck, Edit2 } from "lucide-react";
import FormCompanyProfile from "./FormProfile";

const General = () => {
  const [profile, setProfile] = useState({
    name: "Company Name",
    username: "company",
    email: "company@example.com",
    phone: "08123456789",
    website: "Url Website",
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
    <div className="mx-auto min-h-screen py-6">
      {/* Card */}
      <Card className="">
        <CardHeader className="text-2xl font-bold tracking-widest text-indigo-600">
          Company Information
          <p className="text-sm font-normal text-gray-500 mt-1">
            Basic company info visible to candidates and on job postings
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

          <FormCompanyProfile
            name={profile.name}
            username={profile.username}
            email={profile.email}
            phone={profile.phone}
            handleChange={handleChange}
            editing={editing}
            website={profile.website}
          />

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
