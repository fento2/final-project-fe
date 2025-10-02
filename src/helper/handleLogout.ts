import { apiCall } from "./apiCall";

export const handleLogOut = async (setLogOut: () => void) => {
  try {
    const { data } = await apiCall.get("/auth/logout");
    if (data.success) {
      setLogOut();
     
    }
  } catch (error) {
  
    setLogOut();
  }
};
