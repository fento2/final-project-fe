import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Education {
    degree: string;
    fieldOfStudy: string;
    university: string;
    startDate: string;
    endDate?: string | null;
    description?: string;
}

interface Experience {
    position: string;
    name: string;
    startDate: string;
    endDate?: string | null;
    description?: string;
}

interface Certificate {
    code: string;
}

export interface RightSectionProps {
    cvUrl?: string | null;
    education: Education[];
    experience: Experience[];
    certificates: Certificate[];
}


const RightSection = ({ cvUrl, education, experience, certificates }: RightSectionProps) => {
    return (
        <>
            {/* CV Preview */}
            <div>
                <p className="text-lg font-semibold text-muted-foreground mb-4">CV Preview</p>
                <object
                    data={cvUrl ?? "/dummy-cv.pdf"}
                    type="application/pdf"
                    className="w-full h-[900px] border rounded-md mb-2"
                >
                </object>
                <Button className="bg-indigo-600 hover:bg-indigo-900">
                    <Link href={cvUrl ?? "/dummy-cv.pdf"} target="_blank" rel="noopener noreferrer">
                        View full page
                    </Link>
                </Button>
            </div>

            {/* Education */}
            <div className="space-y-2 text-lg">
                <p className="font-semibold">Education</p>
                <ul className="list-disc pl-5 space-y-2">
                    {education.map((edu, idx) => (
                        <li key={idx}>
                            <p className="font-medium">
                                {edu.degree} in {edu.fieldOfStudy}
                            </p>
                            <p>
                                {edu.university} ({new Date(edu.startDate).getFullYear()} -{" "}
                                {edu.endDate ? new Date(edu.endDate).getFullYear() : "Now"})
                            </p>
                            <p className="text-muted-foreground">{edu.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-full h-0.5 bg-neutral-300 rounded-full" />
            {/* Experience */}
            <div className="space-y-2 text-lg">
                <p className="font-semibold">Experience</p>
                <ul className="list-disc pl-5 space-y-2">
                    {experience.map((exp, idx) => (
                        <li key={idx}>
                            <p className="font-medium">{exp.position} at {exp.name}</p>
                            <p>
                                ({new Date(exp.startDate).getFullYear()} -{" "}
                                {exp.endDate ? new Date(exp.endDate).getFullYear() : "Now"})
                            </p>
                            <p className="text-muted-foreground">{exp.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-full h-0.5 bg-neutral-300 rounded-full" />
            {/* Certificates */}
            <div className="space-y-2 text-lg">
                <p className="font-semibold">Certificates</p>
                <ul className="list-disc pl-5 space-y-1">
                    {certificates.map((cert, idx) => (
                        <li key={idx}>{cert.code}</li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default RightSection;
