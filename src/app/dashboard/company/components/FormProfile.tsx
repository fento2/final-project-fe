"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, useState } from "react";
import TextEditor from "../../components/TextEditor";

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
  const [value, setValue] = useState(
    `<p><span style="color: rgba(0, 0, 0, 0.9); background-color: rgba(0, 0, 0, 0);">As a full stack engineer, you will be responsible for the development and launch of product features. Your role will need to be a combination of team player and individual contributor who has production experience delivering front-end and back-end software at scale. </span></p><p><br></p><p><strong style="color: rgba(0, 0, 0, 0.9); background-color: rgba(0, 0, 0, 0);">Requirements :</strong></p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgba(0, 0, 0, 0.9); background-color: rgba(0, 0, 0, 0);">Candidate must possess at least Bachelor\'s Degree in Engineering (Computer/Telecommunication) or equivalent.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgba(0, 0, 0, 0.9); background-color: rgba(0, 0, 0, 0);">3-5 years of full stack development experience and very good at problem solving, bug fixing, helping team to solve problems.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgba(0, 0, 0, 0.9); background-color: rgba(0, 0, 0, 0);">Experience in components at each layer of modern web applications.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgba(0, 0, 0, 0.9); background-color: rgba(0, 0, 0, 0);">Experience in JavaScript frameworks (e.g Vue.js &amp; Node.js) is a must.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgba(0, 0, 0, 0.9); background-color: rgba(0, 0, 0, 0);">Experience in both front-end and back-end aspects.</span></li></ol><p><br></p><p><strong style="color: rgba(0, 0, 0, 0.9); background-color: rgba(0, 0, 0, 0);">Job Descriptions :</strong></p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgba(0, 0, 0, 0.9); background-color: rgba(0, 0, 0, 0);">Design and implementation of low-latency, high-availability, and performance-oriented applications for Sociolla platform.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgba(0, 0, 0, 0.9); background-color: rgba(0, 0, 0, 0);">Develop, build, test, deploy modules.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgba(0, 0, 0, 0.9); background-color: rgba(0, 0, 0, 0);">Continuously discover, evaluate, and implement new technologies to maximize development efficiency.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgba(0, 0, 0, 0.9); background-color: rgba(0, 0, 0, 0);">Ensure the performance, quality, and responsiveness of the application.</span></li></ol><p><br></p><p><br></p>`
  );
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
          <TextEditor
            editing={editing}
            value={value}
            setValue={setValue}
            profile={true}
          />
        </div>
      </div>
    </>
  );
};
export default FormCompanyProfile;
