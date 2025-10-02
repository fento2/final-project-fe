import axios from "axios";

const fallbackBaseUrl = "http://localhost:3001/api";
const baseURL = process.env.NEXT_PUBLIC_URL_BE || fallbackBaseUrl;

// Public API call instance that doesn't require authentication
export const publicApiCall = axios.create({
  baseURL,
  withCredentials: false, // Don't send cookies for public endpoints
});

// Helper function to try public endpoints for job data
export const fetchJobPublic = async (slug: string) => {
  try {
    // Try to get specific job detail without authentication
    const response = await publicApiCall.get(`/postings/get-detail/${slug}`);
    return response.data;
  } catch (error: any) {
    console.log('Public detail endpoint failed, trying general postings...');
    
    // If specific endpoint fails, try general postings
    try {
      const response = await publicApiCall.get('/postings', {
        params: { limit: 100, sort: 'created_at', order: 'desc' }
      });
      const jobsData = response.data?.data?.data || response.data?.data || response.data || [];
      const jobs = Array.isArray(jobsData) ? jobsData : [];
      
      // Find job by slug or job_id
      const foundJob = jobs.find((j: any) => j.slug === slug || j.job_id?.toString() === slug);
      
      if (foundJob) {
        return { data: foundJob };
      }
      
      throw new Error('Job not found in general postings');
    } catch (generalError) {
      throw generalError;
    }
  }
};

// Helper function to fetch company data without authentication
export const fetchCompanyPublic = async (companyName: string) => {
  try {
    const response = await publicApiCall.get(`/company/name/${encodeURIComponent(companyName)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};