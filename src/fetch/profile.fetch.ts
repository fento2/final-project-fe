import { apiCall } from "@/helper/apiCall";
import {
  schemaUpdateCompanyProfile,
  SchemaUpdateCompanyProfile,
} from "@/validation/company.validation";
import { schemaUpdateProfileUser } from "@/validation/profile.validation";
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

//company role
export const getDataCompanyProfileFetch = async () => {
  try {
    const { data } = await apiCall.get("/company/get-data-profile");
    if (data.success) {
      console.log(data);
      return data.data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateCompanyProfileFetch = async (
  payload: SchemaUpdateCompanyProfile,
  toast: any
) => {
  try {
    const result = schemaUpdateCompanyProfile.safeParse(payload);
    if (!result.success) {
      const messages = result.error.issues[0].message;
      console.log(result);
      toast.error(messages);
      return false;
    }
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("phone", payload.phone ?? "");
    formData.append("website", payload.website ?? "");
    formData.append("description", payload.description ?? "");

    // Hanya append file kalau ada dan valid
    if (payload.profile_picture instanceof File) {
      formData.append("profile_picture", payload.profile_picture);
    }
    const { data } = await apiCall.patch("/company/update-profile", formData);
    if (data.success) {
      return data.success;
    }
  } catch (error: any) {
    console.error("Update failed:", error?.response?.data || error.message);
    toast.error(error?.response?.data?.message || "Failed to update");
    return false;
  }
};
