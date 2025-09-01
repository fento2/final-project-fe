"use client";
import { Building2, FilePen, FileInput, MessagesSquare } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface IUserOption {
  isCollapsed: boolean;
}

const menus = [
  {
    title: "Company Profile",
    icon: Building2,
    href: "/dashboard/company",
  },
  {
    title: "Postings",
    icon: FilePen,
    href: "/dashboard/postings",
  },
  {
    title: "Applicants",
    icon: FileInput,
    href: "/dashboard/applicants",
  },
  {
    title: "Applications",
    icon: MessagesSquare,
    href: "/dashboard/applications", // <- tadi typo: "aplications"
  },
];

const CompanyOption = ({ isCollapsed }: IUserOption) => {
  const pathname = usePathname();

  const variants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -20, opacity: 0 },
  };

  return (
    <div className="flex flex-col gap-3">
      {menus.map(({ title, icon: Icon, href }) => {
        const isActive = pathname === href;

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
  );
};

export default CompanyOption;
