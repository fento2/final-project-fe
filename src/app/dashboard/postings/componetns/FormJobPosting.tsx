"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import TextEditor from "../../company/components/TextEditor";
import dynamic from "next/dynamic";
const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false });

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import BasicForm from "./BasicForm";
import { useCreateJob } from "@/lib/zustand/createJobStore";
import { useEditJob } from "@/lib/zustand/editJobStore";
import { usePathname } from "next/navigation";
import { getValue, setValue } from "@/helper/postingsHelper";

const FormJobPosting = () => {
  const pathname = usePathname();
  const isEdit = pathname.includes("edit");
  const {
    description,
    latitude,
    longitude,
    location,
    preSelection,
    expiredAt,
    setDescription,
    setLatitude,
    setLongitude,
    setLocation,
    setExpiredAt,
    setPreSelection,
  } = useCreateJob();
  const {
    editLatitude,
    editDescription,
    editLongitude,
    editLocation,
    editExpireAt,
    editPreselection,
    setEditPreselection,
    setEditLatitude,
    setEditDescription,
    setEditLongitude,
    setEditLocation,
    setEditExpireAt,
  } = useEditJob();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Job Title */}
        <BasicForm />

        {/* Expired At */}
        <div className="w-full">
          <Label className="text-lg">Expired At</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full sm:w-60 justify-start text-left font-normal py-6 text-lg"
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                {getValue(expiredAt, editExpireAt, pathname) ? (
                  format(
                    new Date(getValue(expiredAt, editExpireAt, pathname)),
                    "PPP"
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  getValue(expiredAt, editExpireAt, pathname)
                    ? new Date(getValue(expiredAt, editExpireAt, pathname))
                    : undefined
                }
                onSelect={(date) => {
                  const val = date?.toISOString() ?? "";
                  setValue(setExpiredAt, setEditExpireAt, val, pathname);
                }}
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
            value={getValue(location, editLocation, pathname)}
            onChange={(e) =>
              setValue(setLocation, setEditLocation, e.target.value, pathname)
            }
            className="py-6 !text-lg w-full"
          />
          <MapPicker
            location={getValue(location, editLocation, pathname)}
            latitude={getValue(latitude, editLatitude, pathname)}
            longitude={getValue(longitude, editLongitude, pathname)}
            setLocation={isEdit ? setEditLocation : setLocation}
            setLatitude={isEdit ? setEditLatitude : setLatitude}
            setLongitude={isEdit ? setEditLongitude : setLongitude}
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2 mt-4">
          <Label className="font-bold text-lg tracking-widest">
            Job Description
          </Label>
          <TextEditor
            value={getValue(description, editDescription, pathname)}
            setValue={isEdit ? setEditDescription : setDescription}
            editing={true}
            showEdit={false}
            profile={false}
          />
          <div className="flex items-center space-x-2 mt-6">
            <Checkbox
              checked={isEdit ? editPreselection : preSelection}
              onCheckedChange={isEdit ? setEditPreselection : setPreSelection}
              className="w-6 h-6"
            />
            <Label className="text-lg">Require Preselection Test</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormJobPosting;
