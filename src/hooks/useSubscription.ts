import { useEffect, useState } from "react";
import { apiCall } from "@/helper/apiCall";
export function useSubscription() {
    const [active, setActive] = useState<boolean | null>(null);
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await apiCall.get("/userSubscription");
                const data = res.data?.data;
                if (mounted) setActive(Array.isArray(data) ? data.length > 0 : Boolean(data));
            } catch {
                if (mounted) setActive(false);
            }
        })();
        return () => { mounted = false; };
    }, []);
    return active;
}