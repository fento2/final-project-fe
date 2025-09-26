import { apiCall } from "./apiCall";

export const handleLogOut = async (setLogOut: () => void) => {
  try {
    const { data } = await apiCall.get("/auth/logout");
    if (data.success) {
      setLogOut();
      console.log(data);
    }
  } catch (error) {
    console.log(error);
    setLogOut();
  }
};
