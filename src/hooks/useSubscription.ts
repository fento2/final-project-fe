import { useEffect, useState } from "react";
import { apiCall } from "@/helper/apiCall";
import { UserSubscriptionActiveDTO } from "@/types/userSubscription";
export function useSubscription() {
    const [active, setActive] = useState<boolean | null>(null);
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await apiCall.get("/userSubscription/user-subscription-active");
                const data: UserSubscriptionActiveDTO = res.data?.data;
                if (!data) {
                    if (mounted) setActive(false);
                } else {
                    if (mounted) setActive(data.payment_status === "APPROVED" ? true : false);
                }
            } catch {
                if (mounted) setActive(false);
            }
        })();
        return () => { mounted = false; };
    }, []);
    return active;
}