import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent } from "react";

interface IFormProfile {
  name: string;
  username: string;
  email: string;
  phone: string;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  editing: boolean;
}
const FormProfile = ({
  name,
  username,
  email,
  phone,
  handleChange,
  editing,
}: IFormProfile) => {
  return (
    <>
      <div>
        {/* Name + Username */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-lg">Name</Label>
            <Input
              type="text"
              name="name"
              value={name}
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
              value={username}
              disabled={true}
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
              value={email}
              disabled={true}
              className="py-6 !text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-lg">Phone</Label>
            <Input
              type="text"
              name="phone"
              value={phone}
              onChange={handleChange}
              disabled={!editing}
              className="py-6 !text-lg"
              placeholder="Input your phone number"
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default FormProfile;
