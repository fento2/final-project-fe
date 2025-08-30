import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent } from "react";
import DescriptionCompany from "./DescriptionCompany";

interface ICompanyProfile {
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  editing: boolean;
}
const FormCompanyProfile = ({
  name,
  username,
  email,
  phone,
  website,
  handleChange,
  editing,
}: ICompanyProfile) => {
  return (
    <>
      <div>
        {/* Name + Username */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-lg" htmlFor="name">
              Company Name
            </Label>
            <Input
              id="name"
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              disabled={!editing}
              className="py-6 !text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-lg" htmlFor="username">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              name="username"
              value={username}
              onChange={handleChange}
              disabled={!editing}
              className="py-6 !text-lg"
            />
          </div>
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-lg" htmlFor="email">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              disabled={!editing}
              className="py-6 !text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-lg" htmlFor="phone">
              Phone
            </Label>
            <Input
              type="text"
              id="phone"
              name="phone"
              value={phone}
              onChange={handleChange}
              disabled={!editing}
              className="py-6 !text-lg"
            />
          </div>
        </div>
        <div className="grid grid-cols-1">
          <div className="space-y-2">
            <Label className="text-lg" htmlFor="website">
              Company Website
            </Label>
            <Input
              type="url"
              id="website"
              name="website"
              value={website}
              onChange={handleChange}
              disabled={!editing}
              className="py-6 !text-lg"
            />
          </div>
        </div>
        <div className="mt-4">
          <span className="font-bold text-lg tracking-widest">
            Description Company
          </span>
          <DescriptionCompany editing={editing} />
        </div>
      </div>
    </>
  );
};
export default FormCompanyProfile;
