"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BadgeCheck } from "lucide-react";
import FormCompanyProfile from "./FormProfile";
import { getDataCompanyProfileFetch, updateCompanyProfileFetch } from "@/fetch/profile.fetch";
import ProfilePicture from "../../components/ProfilePicture";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/basic-toast";

const General = () => {
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    website: "",
    profile_picture: "",
  });

  const [uploadPicture, setUploadPicture] = useState<File | null>(null)
  const [editing, setEditing] = useState(false);
  const [desc, setDesc] = useState('')
  const toast = useToast()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const getData = async () => {
    const result = await getDataCompanyProfileFetch()
    if (result) {
      setProfile(result)
      setDesc(result.description)
    }
  }
  const payload = {
    name: profile.name,
    phone: profile.phone,
    website: profile.website,
    profile_picture: uploadPicture,
    description: desc
  }
  const handleSave = async () => {
    const res = await updateCompanyProfileFetch(payload, toast)
    if (res) {
      getData()
      setEditing(false);
    }

  };

  useEffect(() => {
    getData()
  }, [])


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
          <FormCompanyProfile
            name={profile.name}
            username={profile.username}
            email={profile.email}
            phone={profile.phone}
            handleChange={handleChange}
            editing={editing}
            website={profile.website}
            desc={desc}
            setDesc={setDesc}
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
                  onClick={() => {
                    setEditing(false)
                    getData()
                  }}
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
