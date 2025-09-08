import { apiCall } from "@/helper/apiCall";
import {
  convertDateToMonthYear,
  initialStateEducationForm,
} from "@/helper/profileHelper";
import { EducationState } from "@/lib/zustand/educationStorage";
import {
  schemaCreateEducation,
  schemaUpdateProfileUser,
} from "@/validation/profile.validation";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";

//role user profile
export interface UpdateProfileProps {
  name: string;
  phone: string;
  gender: string;
  birthDate: string;
  address: string;
  profile_picture: File | null;
}
//general
export const updateProfileRoleUserFetch = async (
  toast: {
    success: (title: string, description?: string | undefined) => string;
    error: (title: string, description?: string | undefined) => string;
    warning: (title: string, description?: string | undefined) => string;
    info: (title: string, description?: string | undefined) => string;
  },
  payload: UpdateProfileProps,
  setLoading: (laoding: boolean) => void
) => {
  try {
    setLoading(true);
    const result = schemaUpdateProfileUser.safeParse(payload);
    if (!result.success) {
      console.log(result);
      const messages = result.error.issues
        .map((issue) => issue.message)
        .join(", ");
      return toast.error(messages);
    }

    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("phone", payload.phone);
    formData.append("gender", payload.gender);
    formData.append("birthDate", payload.birthDate);
    formData.append("address", payload.address);

    // Hanya append file kalau ada dan valid
    if (payload.profile_picture instanceof File) {
      formData.append("profile_picture", payload.profile_picture);
    }
    const { data } = await apiCall.patch(
      `/account/update-profile/user`,
      formData
    );
    if (data.success) {
      toast.success(data.message);
      return data;
    }
  } catch (error: unknown) {
    console.log(error);
    return error;
  } finally {
    setLoading(false);
  }
};
export const getProfilRoleUserFetch = async (toast: {
  success: (title: string, description?: string | undefined) => string;
  error: (title: string, description?: string | undefined) => string;
  warning: (title: string, description?: string | undefined) => string;
  info: (title: string, description?: string | undefined) => string;
}) => {
  try {
    const { data } = await apiCall.get("/account/get-data/user");

    if (data.success) {
      console.log(data);
      return data.data;
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.message);
    }
    console.log(error);
    return null;
  }
};

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
  setLoading: (laoding: boolean) => void,
  reset: (
    initial?: Partial<Omit<EducationState, "setField">> | undefined
  ) => void
) => {
  try {
    setLoading(true);
    const result = schemaCreateEducation.safeParse({
      ...data,
      startYear: Number(data.startYear),
      endYear: Number(data.endYear),
      endMonth: data.endMonth || undefined,
    });
    if (!result.success) {
      const messages = result.error.issues[0].message;
      toast.error(messages);
      // console.log(result.error);
      return;
    } else {
      const { data } = await apiCall.post(
        "/account/education/create",
        result.data
      );
      if (data.success) {
        toast.success(data.message);
      }
      console.log("ini lolos", result.data);
    }
  } catch (error: any) {
    toast.error(error.message);
    console.log(error);
    console.log("ini error", error.status);
  } finally {
    setLoading(false);
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
  id: string,
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
    const { data } = await apiCall.get(`/account/education/detail/${id}`);
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
