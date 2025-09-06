import { cn } from "@/lib/utils";
import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface IDeveloperOption {
    isCollapsed: boolean;
}

const menus = [
    {
        title: "List Skill Assessment",
        icon: ClipboardList,
        href: "/dashboard/list-skill-assessment",
    },
]

const DeveloperOption = ({ isCollapsed }: IDeveloperOption) => {
    const pathname = usePathname();

    const variants = {
        open: { x: 0, opacity: 1 },
        closed: { x: -20, opacity: 0 },
    };

    return (
        <div className="grid gap-3">
            {menus.map(({ title, icon: Icon, href }) => {
                const isActive = pathname.startsWith(href);

                return (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
                            isActive && "bg-muted text-blue-600"
                        )}
                    >
                        <Icon className="h-6 w-6" />
                        <motion.li variants={variants}>
                            {!isCollapsed && (
                                <p className="ml-4 text-md font-medium">{title}</p>
                            )}
                        </motion.li>
                    </Link>
                );
            })}
        </div>
    )
}

export default DeveloperOption;