import { apiCall } from "@/helper/apiCall";
import { convertDateToMonthYear } from "@/helper/profileHelper";
import { EducationState } from "@/lib/zustand/educationStorage";
import { schemaEducation } from "@/validation/profile.validation";
import { SetStateAction } from "react";

//education
interface EducationFormProps {
  university: string;
  degree: string;
  fieldOfStudy: string;
  startMonth: string;
  startYear: string;
  endMonth?: string;
  endYear?: string;
  description: string;
}
export const createEducationFetch = async (
  toast: {
    success: (title: string, description?: string) => string;
    error: (title: string, description?: string) => string;
    warning: (title: string, description?: string) => string;
    info: (title: string, description?: string) => string;
  },
  data: EducationFormProps,
  reset: (
    initial?: Partial<Omit<EducationState, "setField">> | undefined
  ) => void,
  setOpen: (value: SetStateAction<boolean>) => void
) => {
  try {
    const result = schemaEducation.safeParse({
      ...data,
      startYear: Number(data.startYear),
      endYear: Number(data.endYear),
      endMonth: data.endMonth || undefined,
    });
    if (!result.success) {
      const messages = result.error.issues[0].message;
      toast.error(messages);
      return;
    } else {
      const { data } = await apiCall.post(
        "/account/education/create",
        result.data
      );
      if (data.success) {
        toast.success(data.message);
        reset();
        return data.success;
      }
      console.log("ini lolos", result.data);
    }
  } catch (error: any) {
    toast.error(error.message);
    console.log(error);
  } finally {
    reset();
    setOpen(false);
  }
};
export interface CardEducationProps {
  education_id: string;
  university: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string; // ISO string dari backend
  endDate?: string; // optional, kalau ongoing
  description?: string;
}
export const getEducationListFetch = async (
  setEducations: (value: SetStateAction<CardEducationProps[]>) => void
) => {
  try {
    const { data } = await apiCall.get("/account/education/list");
    if (data.success) {
      setEducations(data.data);
    }
    console.log(data);
  } catch (error) {
    console.error("Failed to fetch education list:", error);
  }
};
export const getEducationDetailFetch = async (
  education_id: string,
  setField: (
    field:
      | "university"
      | "degree"
      | "fieldOfStudy"
      | "startMonth"
      | "startYear"
      | "endMonth"
      | "endYear"
      | "description"
      | "isEditing"
      | "reset",
    value: any
  ) => void
) => {
  try {
    const { data } = await apiCall.get(
      `/account/education/detail/${education_id}`
    );
    if (data.success) {
      const edu = data.data;

      const start = convertDateToMonthYear(new Date(edu.startDate));
      const end = edu.endDate
        ? convertDateToMonthYear(new Date(edu.endDate))
        : { month: "", year: 0 };

      setField("university", edu.university);
      setField("degree", edu.degree);
      setField("fieldOfStudy", edu.fieldOfStudy);
      setField("startMonth", start.month);
      setField("startYear", start.year.toString());
      setField("endMonth", end.month);
      setField("endYear", end.year ? end.year.toString() : "");
      setField("description", edu.description || "");
      setField("isEditing", true);
      console.log(data);
    }
  } catch (error) {
    console.log(error);
  }
};
export const editEducationFetch = async (
  toast: {
    success: (title: string, description?: string) => string;
    error: (title: string, description?: string) => string;
    warning: (title: string, description?: string) => string;
    info: (title: string, description?: string) => string;
  },
  data: EducationFormProps,
  reset: (
    initial?: Partial<Omit<EducationState, "setField">> | undefined
  ) => void,
  education_id: string,
  setOpen: (value: SetStateAction<boolean>) => void
) => {
  try {
    console.log("run");
    const result = schemaEducation.safeParse({
      ...data,
      startYear: Number(data.startYear),
      endYear: Number(data.endYear),
      endMonth: data.endMonth || undefined,
    });
    if (!result.success) {
      const messages = result.error.issues[0].message;
      toast.error(messages);
      return;
    } else {
      const { data } = await apiCall.patch(
        `/account/education/edit/${education_id}`,
        result.data
      );
      if (data.success) {
        toast.success(data.message);
        return data.success;
      }
      console.log("ini lolos", result.data);
    }
  } catch (error: any) {
    toast.error(error.message);
    console.log(error);
  } finally {
    reset();
    setOpen(false);
  }
};
export const delateEducationFetch = async (
  toast: {
    success: (title: string, description?: string) => string;
    error: (title: string, description?: string) => string;
    warning: (title: string, description?: string) => string;
    info: (title: string, description?: string) => string;
  },
  education_id: string
) => {
  try {
    const { data } = await apiCall.delete(
      `/account/education/delete/${education_id}`
    );
    if (data.success) {
      console.log(data);
      toast.success(data.message);
      return data.success;
    }
  } catch (error) {
    console.log(error);
  }
};
