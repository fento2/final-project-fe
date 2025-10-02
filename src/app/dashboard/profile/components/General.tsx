"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BadgeCheck } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import FormProfile from "./FormProfile";
import { updateProfileRoleUserFetch, getProfilRoleUserFetch } from "@/fetch/profile.fetch";
import { useToast } from "@/components/basic-toast";
import ButtonProfile from "./ButtonProfile";
import { format } from "date-fns";
import { Dots_v2 } from "@/components/ui/spinner";
import ProfilePicture from "../../components/ProfilePicture";
const General = () => {
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    birthDate: "",
    address: "",
    profile_picture: "",
  });
  const [uploadPicture, setUploadPicture] = useState<File | null>(null)
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    const payload = {
      name: profile.name,
      phone: profile.phone,
      gender: profile.gender,
      birthDate: profile.birthDate,
      address: profile.address,
      profile_picture: uploadPicture
    }
    const res = await updateProfileRoleUserFetch(toast, payload, setLoading);
    if (res) {
      getData()
      setEditing(false)
    }
  }
  const getData = async () => {
    const data = await getProfilRoleUserFetch(toast)
    if (data) {
      setProfile({ ...data, gender: data.gender ? data.gender : undefined, phone: data.phone ? data.phone : undefined, birthDate: format(new Date(data.birthDate), 'yyyy-MM-dd') })
    }
  }
  useEffect(() => {
    getData()
  }, [])
  return (
    <div className="mx-auto py-6 relative">
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
        {loading && <div className="absolute top-0 z-50 flex justify-center h-screen w-full">
          <Dots_v2 />

        </div>}
        <CardContent className="space-y-6">
          {/* Avatar + Status */}
          <div className="flex flex-col sm:flex-row gap-6 sm:items-center relative">
            <ProfilePicture
              profile={profile}
              editing={editing}
              setProfile={setProfile}
              setUploadPicture={setUploadPicture}
            />
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
                  <SelectItem value="MALE" className="p-4 text-lg">
                    Male
                  </SelectItem>
                  <SelectItem value="FEMALE" className="p-4 text-lg">
                    Female
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-lg">Date of Birth</Label>
              <Input
                type="date"
                name="birthDate"
                value={profile.birthDate}
                onChange={handleChange}
                disabled={!editing}
                className="py-6 !text-lg"
              />
            </div>
          </div>
          <div className="space-y-2 -mt-4">
            <Label className="text-lg">Address</Label>
            <Input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              disabled={!editing}
              className="py-6 !text-lg"
              placeholder="Enter your address"
            />
          </div>
          {/* Actions */}
          <ButtonProfile editing={editing} setEditing={setEditing} handleSave={handleSave} getData={getData} />
        </CardContent>
      </Card>
    </div>
  );
};
export default General;
