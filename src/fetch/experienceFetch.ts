import { apiCall } from "@/helper/apiCall";

export const fetchData = async () => {
    try {
        const { data } = await apiCall.get("/experiences");
        // setData(data.data)
    } catch (error) {

    }
}