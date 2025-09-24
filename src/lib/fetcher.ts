import { apiCall } from "@/helper/apiCall";
import { ZodSchema } from "zod";

export const fetcher = async <T>(url: string, schema: ZodSchema<T>): Promise<T> => {
    const response = await apiCall.get(url);
    return schema.parse(response.data.data);
};