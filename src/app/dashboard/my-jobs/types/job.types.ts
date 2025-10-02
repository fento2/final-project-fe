export interface Job {
    nameJob: string;
    nameCompany: string;
    status: "Current" | "Past";
    wage: string;
    periodStart: string;
    periodEnd: string;
    companyLogo?: string | null;
}

export const statusColors: Record<Job["status"], string> = {
    "Current": "bg-green-100 text-green-700",
    "Past": "bg-blue-100 text-blue-700",
};