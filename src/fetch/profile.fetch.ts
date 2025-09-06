import { apiCall } from "@/helper/apiCall";
import { schemaUpdateProfileUser } from "@/validation/updateProfileUser.validation";
import axios from "axios";

export interface UpdateProfileProps {
  name: string;
  username: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: string;
  avatar: string;
}
export const fetchUUpdateProfile = async (
  payload: UpdateProfileProps,
  setError: (value: React.SetStateAction<string>) => void,
  setLoading: (laoding: boolean) => void
) => {
  try {
    setLoading(true);
    setError("");
    const result = schemaUpdateProfileUser.safeParse(payload);
    if (!result.success) {
      const messages = result.error.issues[0].message;
      return setError(messages);
    }
    const { data } = await apiCall.patch("/account/profile/user", payload);
    if (data.success) {
      setError("");
      return data;
    }
  } catch (error: unknown) {
    console.log(error);
    return error;
  } finally {
    // setLoading(false);
  }
};
