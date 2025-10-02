import { apiCall } from "@/helper/apiCall";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { useToast } from "../basic-toast";

type CertificateItem = {
    assessment_certificate_id: number;
    user_assessment_id: number;
    certificate_code: string;
    createAt: string;
    updatedAt: string;
    user_assessment: {
        user_assessment_id: number;
        assessment_id: number;
        user_id: number;
        score: number;
        date_taken: string;
        createAt: string;
        updatedAt: string;
        assessment?: {
            assessment_id: number;
            skill_name: string;
            createAt: string;
            updatedAt: string;
            deletedAt: string | null;
        };
    };
};

export default function CertificateBadge({ id }: { id?: number }) {
    const [items, setItems] = useState<CertificateItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

    const fetchData = async () => {
        setLoading(true);
        try {
            let res;
            if (id) {
                res = await apiCall.get(`/assessmentCertificate/getAllCertificate/byUserId/${id}`);
            } else {
                res = await apiCall.get(`/assessmentCertificate/getAllCertificate/byUserId`);
            }
            if (res.status !== 200) { setError("Fetch data failed"); return };
            setItems(res.data.data);
        } catch (error: any) {
            setError(error.message || "Failed to load certificates");
        } finally {
            setLoading(false);
        }
    }

    async function copyToClipboard(code: string) {
        try {
            await navigator.clipboard.writeText(code);
            toast.success("Certificate code copied to clipboard")
        } catch {
            toast.error("Failed to copy");
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading) return <div className="text-sm text-gray-500">Loading certificates...</div>;
    if (error) return <div className="text-sm text-red-600">Error: {error}</div>;
    if (!items || items.length === 0) return <div className="text-sm text-gray-500">No certificates found.</div>;

    return (
        <div className="flex flex-wrap gap-3">
            {items.map((it) => {
                const skill = it.user_assessment.assessment?.skill_name || "Unknown Skill";
                return (
                    <Badge key={it.assessment_certificate_id} className="bg-blue-600 hover:bg-blue-700 w-fit" onClick={() => copyToClipboard(it.certificate_code)}>{skill}</Badge>
                );
            })}
        </div>
    )
}