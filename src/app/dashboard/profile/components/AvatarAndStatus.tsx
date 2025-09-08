import { useToast } from "@/components/basic-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2, UserCircle2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface Profile {
    name: string;
    username: string;
    email: string;
    phone: string;
    gender: string;
    birthDate: string;
    address: string;
    profile_picture: string;
}

interface ProfilePictureProps {
    profile: Profile;
    editing: boolean;
    setProfile: Dispatch<SetStateAction<Profile>>;
    setUploadPicture: Dispatch<SetStateAction<File | null>>
}

const ProfilePicture = ({
    profile,
    editing,
    setProfile,
    setUploadPicture,
}: ProfilePictureProps) => {
    const toast = useToast()
    return (
        <div className="flex flex-col sm:flex-row gap-6 sm:items-center relative">
            <div className="relative w-50 h-50 mx-auto sm:mx-0">
                <Avatar className="w-50 h-50 rounded-full">
                    <AvatarImage
                        src={profile.profile_picture}
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
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-full cursor-pointer hover:bg-black/60 transition"
                    >
                        <Edit2 className="w-5 h-5 text-white mb-1" />
                        <span className="text-white font-medium flex flex-col">
                            Upload Foto
                            <span className="text-xs">Max size 2mb</span>
                        </span>
                        <Input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const maxSize = 2 * 1024 * 1024; // 2 MB
                                    if (file.size > maxSize) {
                                        toast.warning("Maximum size 2MB");
                                        e.target.value = ""; // reset input
                                        return;
                                    }
                                    const imgUrl = URL.createObjectURL(file);
                                    setProfile({ ...profile, profile_picture: imgUrl });
                                    setUploadPicture(file);
                                }
                            }}
                        />
                    </Label>
                )}
            </div>
        </div>
    );
};

export default ProfilePicture;
