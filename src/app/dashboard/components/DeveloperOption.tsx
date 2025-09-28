import { cn } from "@/lib/utils";
import { ChevronDown, ClipboardList, ListIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface IDeveloperOption {
    isCollapsed: boolean;
}

const menus = [
    {
        title: "List Skill Assessment",
        icon: ClipboardList,
        sub: [
            { title: "List Skill Assessment", href: "/dashboard/list-skill-assessment" },
            { title: "User Skill Assessment", href: "/dashboard/user-skill-assessment" },
        ],
    },
    {
        title: "Subscriptions",
        icon: ListIcon,
        sub: [
            { title: "List Subscriptions", href: "/dashboard/subscription" },
            { title: "User Subscription", href: "/dashboard/user-subscription" },
        ],
    },
]

const DeveloperOption = ({ isCollapsed }: IDeveloperOption) => {
    const pathname = usePathname();
    const [open, setOpen] = useState<string | null>(null);

    const variants = {
        open: { x: 0, opacity: 1 },
        closed: { x: -20, opacity: 0 },
    };

    return (
        <div className="grid gap-3">
            {menus.map(({ title, icon: Icon, sub }) => {
                const isOpen = open === title;

                return (
                    <div key={title} className="flex flex-col">
                        <button
                            onClick={() => setOpen(isOpen ? null : title)}
                            className={cn(
                                "flex h-8 items-center rounded-md px-2 py-1.5 transition hover:bg-muted",
                                sub?.some((s) => s.href === pathname) && "bg-muted text-blue-600"
                            )}
                        >
                            <Icon className="h-6 w-6 flex-shrink-0" />
                            {!isCollapsed && (
                                <div className="ml-4 flex w-full items-center justify-between">
                                    <p className="text-md font-medium">{title}</p>
                                    <ChevronDown
                                        className={cn(
                                            "h-4 w-4 transition-transform",
                                            isOpen && "rotate-180"
                                        )}
                                    />
                                </div>
                            )}
                        </button>

                        <AnimatePresence>
                            {sub && isOpen && !isCollapsed && (
                                <motion.ul
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="ml-9 flex flex-col gap-1 text-sm overflow-hidden"
                                >
                                    {sub.map((item) => (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "block rounded-md px-2 py-1 hover:bg-muted",
                                                    pathname === item.href && "bg-muted text-blue-600"
                                                )}
                                            >
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    )
}

export default DeveloperOption;