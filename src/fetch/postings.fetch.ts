import { apiCall } from "@/helper/apiCall";
import { schemaJobsInput } from "@/validation/postings.validation";

export const postingsCreateFetch = async (payload: any, toast: any) => {
  try {
    const result = schemaJobsInput.safeParse(payload);
    if (!result.success) {
      const messages = result.error.issues[0].message;
      toast.error(messages);
      console.log(result.error);
      return;
    }
    const { data } = await apiCall.post("/postings/create", result.data);
    if (data.success) {
      toast.success(data.message);
      return data.success;
    }
  } catch (error) {
    toast.error("faild create job");
    console.log(error);
    return false;
  }
};
