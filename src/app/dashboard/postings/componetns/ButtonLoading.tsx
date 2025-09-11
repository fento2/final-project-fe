"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dots_v2, } from "@/components/ui/spinner";


interface ButtonLoadingProps {
    text: string
    url: string
    icon: LucideIcon
}
const ButtonLoading = (props: ButtonLoadingProps) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setLoading(true);
        router.push(`${props.url}`);
    };

    return (
        <Button
            className="bg-indigo-600 hover:bg-indigo-800 text-white flex items-center gap-2"
            onClick={handleClick}
            disabled={loading}
        >
            {!loading ? <>{<props.icon />} {props.text}</> : <Dots_v2 />}

        </Button>
    );
};

export default ButtonLoading;
