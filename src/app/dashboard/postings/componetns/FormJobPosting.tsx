"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import TextEditor from "../../company/components/TextEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JOB_CATEGORIES, JOB_TYPES } from "@/constants/job";

import LocationInput from "./MapPicker";
import { useCreateJob } from "@/lib/zustand/createJobStore";

const FormJobPosting = () => {
  const {
    title,
    setTitle,
    category,
    setCategory,
    description,
    setDescription,
    location,
    setLocation,
    salary,
    setSalary,
    jobType,
    setJobType,
    preSelection,
    setPreSelection,
    longitude,
    setLongitude,
    latitude,
    setLatitude,
  } = useCreateJob();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-lg">
            Job Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="py-6 text-lg"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-lg">
            Category
          </Label>
          <Select onValueChange={setCategory} value={category}>
            <SelectTrigger className="w-full py-6 text-lg">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {JOB_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Job Type */}
        <div className="space-y-2">
          <Label htmlFor="jobType" className="text-lg">
            Job Type
          </Label>
          <Select onValueChange={setJobType} value={jobType}>
            <SelectTrigger className="w-full py-6 text-lg">
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              {JOB_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Salary */}
        <div className="space-y-2">
          <Label htmlFor="salary" className="text-lg">
            Salary
          </Label>
          <Input
            id="salary"
            type="number"
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
            className="py-6 text-lg"
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location" className="text-lg">
          Location {"(City)"}
        </Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="py-6 !text-lg"
        />
        <LocationInput
          location={location}
          latitude={latitude}
          longitude={longitude}
          setLocation={setLocation}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
        />
      </div>

      {/* Preselection Test */}
      <div className="flex items-center space-x-2 mt-6">
        <Checkbox
          checked={preSelection}
          onCheckedChange={setPreSelection}
          className="w-6 h-6"
        />
        <Label className="text-lg">Require Preselection Test</Label>
      </div>

      {/* Description */}
      <div className="mt-4">
        <Label className="font-bold text-lg tracking-widest">
          Job Description
        </Label>
        <TextEditor value={description} setValue={setDescription} editing />
      </div>
    </div>
  );
};

export default FormJobPosting;
