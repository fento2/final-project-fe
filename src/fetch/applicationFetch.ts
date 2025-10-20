import { apiCall } from "@/helper/apiCall";
import { AxiosResponse } from "axios";

export interface ApplicationData {
  expected_salary: number;
  cv: File; // File object to upload
  job_id: number;
}

export interface ApplicationResponse {
  application_id: number;
  expected_salary: number;
  cv: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user_id: number;
  job_id: number;
  job_title?: string;
  company_name?: string;
  company_logo?: string | null;
  location?: string;
  salary?: number | null;
  periodSalary?: string | null;
  currency?: string | null;
  job_expired_at?: string | null;
  job_slug?: string | null;
}

export interface ApplicationListResponse {
  applications: ApplicationResponse[];
  total: number;
  page: number;
  limit: number;
}

// Submit a new job application
export const submitApplication = async (
  applicationData: ApplicationData
): Promise<ApplicationResponse> => {
  const formData = new FormData();
  formData.append("job_id", applicationData.job_id.toString());
  formData.append(
    "expected_salary",
    applicationData.expected_salary.toString()
  );
  formData.append("cv", applicationData.cv);

  try {
    const response: AxiosResponse = await apiCall.post(
      "/applications",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to submit application"
    );
  }
};

// Get user's applications (for USER role)
const normalizeApplication = (item: any): ApplicationResponse => {
  const expected_salary =
    typeof item?.expected_salary === "string"
      ? parseInt(item.expected_salary)
      : item?.expected_salary ?? 0;
  return {
    application_id:
      item?.application_id ?? item?.id ?? item?.applicationId ?? 0,
    expected_salary,
    cv: item?.cv ?? item?.cv_url ?? item?.resume_url ?? "",
    status: item?.status ?? "SUBMITTED",
    createdAt: item?.createdAt ?? item?.created_at ?? item?.applied_at ?? "",
    updatedAt: item?.updatedAt ?? item?.updated_at ?? "",
    user_id: item?.user_id ?? item?.userId ?? 0,
    job_id: item?.job_id ?? item?.jobId ?? 0,
    job_title: item?.job_title,
    company_name: item?.company_name,
    company_logo: item?.company_logo ?? null,
    location: item?.location,
    salary: item?.salary ?? null,
    periodSalary: item?.periodSalary ?? null,
    currency: item?.currency ?? null,
    job_expired_at: item?.job_expired_at ?? null,
    job_slug: item?.job_slug ?? null,
  };
};

const normalizeListResponse = (
  data: any,
  page: number,
  limit: number
): ApplicationListResponse => {
  const rawApps =
    data?.applications ??
    data?.data?.applications ??
    data?.data?.data ??
    data?.data ??
    data?.items ??
    data?.results ??
    [];
  const appsArray = Array.isArray(rawApps) ? rawApps : [];
  const applications = appsArray.map(normalizeApplication);
  const total = data?.total ?? data?.data?.total ?? applications.length;
  const pageLimit = data?.limit ?? data?.data?.limit ?? limit;
  const offset = data?.offset ?? data?.data?.offset ?? 0;
  const currentPage = pageLimit ? Math.floor(offset / pageLimit) + 1 : page;
  return { applications, total, page: currentPage, limit: pageLimit };
};

export const getUserApplications = async (
  page: number = 1,
  limit: number = 10
): Promise<ApplicationListResponse> => {
  try {
    const offset = (page - 1) * limit;
    const response: AxiosResponse = await apiCall.get(
      `/applications/my-applications?limit=${limit}&offset=${offset}`
    );
    return normalizeListResponse(response.data, page, limit);
  } catch (error: any) {
    const status = error?.response?.status;
    // Fallback to generic endpoint if /applications/user isn't available
    if (status === 404 || status === 400 || status === 405) {
      try {
        const offset = (page - 1) * limit;
        const resp: AxiosResponse = await apiCall.get(
          `/applications/my-applications?limit=${limit}&offset=${offset}`
        );
        return normalizeListResponse(resp.data, page, limit);
      } catch (err2: any) {
        throw new Error(
          err2.response?.data?.message || "Failed to fetch applications"
        );
      }
    }
    throw new Error(
      error.response?.data?.message || "Failed to fetch applications"
    );
  }
};

// Get job applicants list (for COMPANY role)
export const getJobApplicants = async (
  jobSlug: string
): Promise<ApplicationListResponse> => {
  try {
    const response: AxiosResponse = await apiCall.get(
      `/applications/company/list/${jobSlug}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch job applicants"
    );
  }
};

// Get application detail (for COMPANY role)
export const getApplicationDetail = async (
  applicationId: number
): Promise<ApplicationResponse> => {
  try {
    const response: AxiosResponse = await apiCall.get(
      `/applications/detail/${applicationId}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch application detail"
    );
  }
};

// Update application status (for COMPANY role)
export const updateApplicationStatus = async (
  applicationId: number,
  status: "SUBMITTED" | "INTERVIEW" | "ACCEPTED" | "REJECTED"
): Promise<ApplicationResponse> => {
  try {
    const response: AxiosResponse = await apiCall.patch(
      `/applications/update/${status}/${applicationId}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update application status"
    );
  }
};

// Check if user has already applied to a job
export const checkApplicationExists = async (
  jobId: number
): Promise<boolean> => {
  try {
    const response: AxiosResponse = await apiCall.get(
      `/applications/check/${jobId}`
    );
    return response.data.exists || false;
  } catch (error) {
    return false;
  }
};

// Download CV file
export const downloadCV = async (applicationId: number): Promise<Blob> => {
  try {
    const response: AxiosResponse = await apiCall.get(
      `/applications/${applicationId}/cv`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to download CV");
  }
};
