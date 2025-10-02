import { apiCall } from "@/helper/apiCall";
import { schemaJobsInput } from "@/validation/postings.validation";

export const postingsCreateFetch = async (
  payload: any,
  toast: any,
  setLoading: (val: boolean) => void
) => {
  try {
    setLoading(true);
    const result = schemaJobsInput.safeParse(payload);
    if (!result.success) {
      const messages = result.error.issues[0].message;
      toast.error(messages);

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
  } finally {
    setLoading(false);
  }
};
export const getDetailForEditFetch = async (
  useEditJobStore: any,
  slug: string,
  setLoading: (val: boolean) => void
) => {
  try {
    setLoading(true);
    const {
      setEditCategory,
      setEditCurrency,
      setEditDescription,
      setEditExpireAt,
      setEditJobType,
      setEditLatitude,
      setEditLocation,
      setEditLongitude,
      setEditSalary,
      setEditPeriodSalary,
      setEditTitle,
      setEditSkills,
    } = useEditJobStore.getState();
    const { data } = await apiCall.get(`/postings/get-detail/${slug}`);
    if (data.success) {
      setEditTitle(data.data.title);
      setEditCategory(data.data.category);
      setEditCurrency(data.data.currency);
      setEditDescription(data.data.description);
      setEditExpireAt(data.data.expiredAt);
      setEditLongitude(data.data.longitude);
      setEditLatitude(data.data.latitude);
      setEditLocation(data.data.location);
      setEditSalary(data.data.salary);
      setEditPeriodSalary(data.data.periodSalary);
      setEditJobType(data.data.job_type);
      setEditSkills(data.data.skills);
    }
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};
export const updateJobPostingFetch = async (
  useEditJobStore: any,
  toast: any,
  setLoading: (val: boolean) => void,
  slug: string
) => {
  try {
    setLoading(true);
    const {
      editCategory,
      editCurrency,
      editDescription,
      editExpiredAt,
      editJobType,
      editLatitude,
      editLocation,
      editLongitude,
      editPeriodSalary,
      editSalary,
      editSkills,
      editTitle,
    } = useEditJobStore.getState();

    const payload = {
      category: editCategory,
      currency: editCurrency,
      description: editDescription,
      expiredAt: editExpiredAt,
      job_type: editJobType,
      latitude: editLatitude,
      location: editLocation,
      longitude: editLongitude,
      periodSalary: editPeriodSalary,
      salary: editSalary,
      skills: editSkills,
      title: editTitle,
    };
    const result = schemaJobsInput.safeParse(payload);
    if (!result.success) {
      const messages = result.error.issues[0].message;
      toast.error(messages);
      console.log(result.error);
      return;
    }
    const { data } = await apiCall.patch(
      `/postings/update/${slug}`,
      result.data
    );
    if (data.success) {
      toast.success(data.message);
      return data.success;
    }
  } catch (error) {
    toast.error("faild update job");
    console.log(error);
    return false;
  } finally {
    setLoading(false);
  }
};

export const getApplicantIdFetch = async (job_id: number) => {
  try {
    const { data } = await apiCall.get(`/postings/applicant_id/${job_id}`);
    if (data.success) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};
