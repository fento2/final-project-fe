"use client";
import {
  Briefcase,
  MessagesSquare,
  UserPenIcon,
  ChevronDown,
  Star,
  CircleDollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

interface IUserOption {
  isCollapsed: boolean;
}

const menus = [
  {
    title: "Profile",
    icon: UserPenIcon,
    href: "/dashboard/profile",
  },
  {
    title: "Jobs",
    icon: Briefcase,
    sub: [
      { title: "My Applications", href: "/dashboard/my-applications" },
      { title: "My Jobs", href: "/dashboard/my-jobs" },
      { title: "Job Saves", href: "/dashboard/job-saves" },
    ],
  },
  {
    title: "Skill",
    icon: Star,
    sub: [
      { title: "My Skill", href: "/dashboard/my-skill" },
      { title: "Skill Assessment", href: "/dashboard/skill-assessment" },
    ],
  },
  {
    title: "Subscription",
    icon: CircleDollarSign,
    href: "/dashboard/my-subscription",
  },
];

const UserOption = ({ isCollapsed }: IUserOption) => {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);

  const variants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -20, opacity: 0 },
  };

  return (
    <div className="flex flex-col gap-2">
      {menus.map((menu) => {
        const Icon = menu.icon;
        const isActive =
          pathname === menu.href || menu.sub?.some((s) => s.href === pathname);

        return (
          <div key={menu.title} className="flex flex-col">
            {/* Parent */}
            {menu.href ? (
              <Link
                href={menu.href}
                className={cn(
                  "flex h-8 items-center rounded-md px-2 py-1.5 transition hover:bg-muted",
                  isActive && "bg-muted text-blue-600"
                )}
              >
                <Icon className="h-6 w-6 flex-shrink-0" />
                <motion.li variants={variants}>
                  {!isCollapsed && (
                    <p className="ml-4 text-md font-medium">{menu.title}</p>
                  )}
                </motion.li>
              </Link>
            ) : (
              <button
                onClick={() => setOpen(open === menu.title ? null : menu.title)}
                className={cn(
                  "flex h-8 items-center rounded-md px-2 py-1.5 transition hover:bg-muted",
                  isActive && "bg-muted text-blue-600"
                )}
              >
                <Icon className="h-6 w-6 flex-shrink-0" />
                <motion.li
                  variants={variants}
                  className="flex w-full items-center"
                >
                  {!isCollapsed && (
                    <div className="ml-4 flex w-full items-center justify-between">
                      <p className="text-md font-medium">{menu.title}</p>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          open === menu.title && "rotate-180"
                        )}
                      />
                    </div>
                  )}
                </motion.li>
              </button>
            )}

            {/* Submenu */}
            <AnimatePresence>
              {menu.sub && open === menu.title && !isCollapsed && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="ml-9 flex flex-col gap-1 text-sm overflow-hidden"
                >
                  {menu.sub.map((sub) => (
                    <li key={sub.href}>
                      <Link
                        href={sub.href}
                        className={cn(
                          "block rounded-md px-2 py-1 hover:bg-muted",
                          pathname === sub.href && "bg-muted text-blue-600"
                        )}
                      >
                        {sub.title}
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
  );
};

export default UserOption;
