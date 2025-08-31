"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import TextEditor from "../../../company/components/TextEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JOB_CATEGORIES, JOB_TYPES } from "@/constants/jobConstan";

import dynamic from "next/dynamic";

const LocationInput = dynamic(() => import("../../componetns/MapPicker"), {
  ssr: false, // disable SSR
});

import { useCreateJob } from "@/lib/zustand/createJobStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const CreateFormJobPosting = () => {
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
    salaryPeriod,
    setSalaryPeriod,
    currency,
    setCurrency,
    jobType,
    setJobType,
    expiredAt,
    setExpiredAt,
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
        {/* Job Title */}
        <div className="md:col-span-2">
          <Label htmlFor="title" className="text-lg">
            Job Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Job Title"
            className="py-6 !text-lg w-full"
          />
        </div>

        {/* Category */}
        <div className="md:col-span-2">
          <Label htmlFor="category" className="text-lg">
            Category
          </Label>
          <Select onValueChange={setCategory} value={category}>
            <SelectTrigger className="w-full p-6 text-lg">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {JOB_CATEGORIES.map((cat) => (
                <SelectItem
                  key={cat.value}
                  value={cat.value}
                  className="p-4 text-lg"
                >
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Job Type */}
        <div className="md:col-span-2">
          <Label htmlFor="jobType" className="text-lg">
            Job Type
          </Label>
          <Select onValueChange={setJobType} value={jobType}>
            <SelectTrigger className="w-full p-6 text-lg">
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              {JOB_TYPES.map((type) => (
                <SelectItem
                  key={type.value}
                  value={type.value}
                  className="p-4 text-lg"
                >
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Salary */}
        <div className="md:col-span-2 flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Label htmlFor="salary" className="text-lg">
              Salary
            </Label>
            <Input
              id="salary"
              type="number"
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              placeholder="Enter salary"
              className="py-6 !text-lg w-full"
            />
          </div>
          <div>
            <Label className="text-lg">Period</Label>
            <Select onValueChange={setSalaryPeriod} value={salaryPeriod}>
              <SelectTrigger className="w-full sm:w-40 text-lg py-6">
                <SelectValue placeholder="/ Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month" className="text-lg p-4">
                  / Month
                </SelectItem>
                <SelectItem value="year" className="text-lg p-4">
                  / Year
                </SelectItem>
                <SelectItem value="day" className="text-lg p-4">
                  / Day
                </SelectItem>
                <SelectItem value="hour" className="text-lg p-4">
                  / Hour
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-lg">Currency</Label>
            <Select onValueChange={setCurrency} value={currency}>
              <SelectTrigger className="w-full sm:w-32 py-6 text-lg">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IDR" className="text-lg p-4">
                  Rp
                </SelectItem>
                <SelectItem value="USD" className="text-lg p-4">
                  $
                </SelectItem>
                <SelectItem value="EUR" className="text-lg p-4">
                  €
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Expired At */}
        </div>
        <div className="w-full">
          <Label className="text-lg">Expired At</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full sm:w-60 justify-start text-left font-normal py-6 text-lg"
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                {expiredAt ? (
                  format(new Date(expiredAt), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={expiredAt ? new Date(expiredAt) : undefined}
                onSelect={(date) => setExpiredAt(date?.toISOString() ?? "")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Location */}
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="location" className="text-lg">
            Location (City)
          </Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="py-6 !text-lg w-full"
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

        {/* Description */}
        <div className="md:col-span-2 mt-4">
          <Label className="font-bold text-lg tracking-widest">
            Job Description
          </Label>
          <TextEditor value={description} setValue={setDescription} editing />
          <div className="flex items-center space-x-2 mt-6">
            <Checkbox
              checked={preSelection}
              onCheckedChange={setPreSelection}
              className="w-6 h-6"
            />
            <Label className="text-lg">Require Preselection Test</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFormJobPosting;
